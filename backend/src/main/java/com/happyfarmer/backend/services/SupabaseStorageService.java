package com.happyfarmer.backend.services;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

import java.io.IOException;
import java.util.UUID;

@Service
public class SupabaseStorageService {

    private final S3Client s3Client;

    @Value("${supabase.s3.endpoint}")
    private String endpoint;

    public SupabaseStorageService(S3Client s3Client) {
        this.s3Client = s3Client;
    }

    /**
     * Uploads a file to a Supabase bucket using S3-compatible API.
     * 
     * @param file   The file to upload.
     * @param bucket The bucket name (e.g. "product-images").
     * @return The public URL of the uploaded file.
     */
    public String uploadFile(MultipartFile file, String bucket) throws IOException {
        String originalName = file.getOriginalFilename();
        String fileName = UUID.randomUUID().toString() + "_" + (originalName != null ? originalName : "file");

        PutObjectRequest putObjectRequest = PutObjectRequest.builder()
                .bucket(bucket)
                .key(fileName)
                .contentType(file.getContentType())
                .build();

        s3Client.putObject(putObjectRequest, RequestBody.fromBytes(file.getBytes()));

        // Construct the public URL
        // Supabase public URL structure:
        // https://[project-id].supabase.co/storage/v1/object/public/[bucket]/[filename]
        // The endpoint provided by user is
        // https://eoftjswajkmkextmlgma.storage.supabase.co/storage/v1/s3
        // We can derive the public URL base from the endpoint.

        String publicUrlBase = endpoint.replace("/storage/v1/s3", "/storage/v1/object/public");
        return String.format("%s/%s/%s", publicUrlBase, bucket, fileName);
    }
}
