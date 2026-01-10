import { NextRequest, NextResponse } from 'next/server';
import pinataSDK from '@pinata/sdk';
import { writeFile, unlink } from 'fs/promises';
import path from 'path';

import os from 'os';

export async function POST(request: NextRequest) {
    try {
        // Validate Pinata credentials before proceeding
        if (!process.env.PINATA_API_KEY || !process.env.PINATA_SECRET_API_KEY) {
            console.error('Pinata credentials missing. Please set PINATA_API_KEY and PINATA_SECRET_API_KEY in .env.local');
            return NextResponse.json(
                {
                    error: 'Pinata API credentials not configured on server',
                    hint: 'Please ensure PINATA_API_KEY and PINATA_SECRET_API_KEY are set in .env.local'
                },
                { status: 500 }
            );
        }

        // Initialize Pinata SDK with validated credentials
        const pinata = new pinataSDK(
            process.env.PINATA_API_KEY,
            process.env.PINATA_SECRET_API_KEY
        );

        const formData = await request.formData();
        const image = formData.get('image') as File;
        const name = formData.get('name') as string;
        const description = formData.get('description') as string;

        if (!image || !name || !description) {
            return NextResponse.json(
                { error: 'Missing required fields' },
                { status: 400 }
            );
        }

        // Convert File to Buffer and save temporarily
        const bytes = await image.arrayBuffer();
        const buffer = Buffer.from(bytes);



        // Use system temp directory which is writable in Lambda/Netlify
        const tempDir = os.tmpdir();
        const tempFilePath = path.join(tempDir, image.name);

        // Ensure tmp directory exists
        const fs = require('fs');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        await writeFile(tempFilePath, buffer);

        // Upload image to IPFS
        const { createReadStream } = require('fs');
        const readableStream = createReadStream(tempFilePath);

        const imageResult = await pinata.pinFileToIPFS(readableStream, {
            pinataMetadata: {
                name: `${name}_image`,
            },
        });

        const imageCID = imageResult.IpfsHash;

        // Create metadata JSON
        const metadata = {
            name,
            description,
            image: `ipfs://${imageCID}`,
        };

        // Upload metadata to IPFS
        const metadataResult = await pinata.pinJSONToIPFS(metadata, {
            pinataMetadata: {
                name: `${name}_metadata`,
            },
        });

        const metadataCID = metadataResult.IpfsHash;
        const metadataURI = `ipfs://${metadataCID}`;

        // Clean up temporary file
        await unlink(tempFilePath);

        return NextResponse.json({
            success: true,
            metadataURI,
            imageCID,
            metadataCID,
        });
    } catch (error: any) {
        console.error('Upload error:', error);
        return NextResponse.json(
            { error: error.message || 'Upload failed' },
            { status: 500 }
        );
    }
}
