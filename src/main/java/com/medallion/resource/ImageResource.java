package com.medallion.resource;

import jakarta.ws.rs.Consumes;
import jakarta.ws.rs.GET;
import jakarta.ws.rs.POST;
import jakarta.ws.rs.Path;
import jakarta.ws.rs.Produces;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.jboss.resteasy.reactive.RestForm;
import org.jboss.resteasy.reactive.multipart.FileUpload;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.Map;
import java.util.UUID;

@Path("/images")
public class ImageResource {

    private static final java.nio.file.Path UPLOAD_DIR = Paths.get("uploads");

    @POST
    @Consumes(MediaType.MULTIPART_FORM_DATA)
    @Produces(MediaType.APPLICATION_JSON)
    public Response upload(@RestForm("file") FileUpload file) throws IOException {
        Files.createDirectories(UPLOAD_DIR);
        String filename = UUID.randomUUID() + "_" + file.fileName();
        Files.copy(file.uploadedFile(), UPLOAD_DIR.resolve(filename));
        return Response.ok(Map.of("filename", filename)).build();
    }

    @GET
    @Path("/{filename}")
    public Response serve(String filename) throws IOException {
        java.nio.file.Path path = UPLOAD_DIR.resolve(filename);
        if (!Files.exists(path)) {
            return Response.status(404).build();
        }
        String contentType = Files.probeContentType(path);
        return Response.ok(Files.readAllBytes(path))
                .type(contentType != null ? contentType : "application/octet-stream")
                .build();
    }
}
