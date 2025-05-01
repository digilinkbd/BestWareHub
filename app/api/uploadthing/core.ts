import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";

const f = createUploadthing();

// FileRouter for your app, can contain multiple FileRoutes
export const ourFileRouter = {
  // Define as many FileRoutes as you like, each with a unique routeSlug
  categoryImage: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "COLLINZ" };
    }
  ),
  productImage: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "COLLINZ" };
    }
  ),
  campaign: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "COLLINZ" };
    }
  ),
  subcategoryImage: f({ image: { maxFileSize: "8MB", maxFileCount: 4 } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "COLLINZ" };
    }
  ),
  departmentImage: f({
    image: { maxFileSize: "8MB", maxFileCount: 4 },
  })
    // Set permissions and file types for this FileRoute
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("file url", file.url, metadata);
      return { uploadedBy: "COLLINZ" };
    }),
  blogImage: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "COLLINZ" };
    }
  ),
  singleProductImage: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "COLLINZ" };
    }
  ),
  storeLogo: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "COLLINZ" };
    }
  ),

  storeBanner: f({ image: { maxFileSize: "1MB" } }).onUploadComplete(
    async ({ metadata, file }) => {
      console.log("file url", file.url);
      return { uploadedBy: "COLLINZ" };
    }
  ),
  fileUploads: f({
    image: { maxFileSize: "1MB", maxFileCount: 4 },
    pdf: { maxFileSize: "1MB", maxFileCount: 4 },
    "application/msword": { maxFileSize: "1MB", maxFileCount: 4 }, // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .docx
    "application/vnd.ms-excel": { maxFileSize: "1MB", maxFileCount: 4 }, // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .xlsx
    "application/vnd.ms-powerpoint": { maxFileSize: "1MB", maxFileCount: 4 }, // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      { maxFileSize: "1MB", maxFileCount: 4 }, // .pptx
    "text/plain": { maxFileSize: "1MB", maxFileCount: 4 }, // .txt

    // Archive types
    "application/gzip": { maxFileSize: "1MB", maxFileCount: 4 },
    "application/zip": { maxFileSize: "1MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url);
    return { uploadedBy: "COLLINZ" };
  }),
  idProof: f({
    image: { maxFileSize: "1MB", maxFileCount: 4 },
    pdf: { maxFileSize: "1MB", maxFileCount: 4 },
    "application/msword": { maxFileSize: "1MB", maxFileCount: 4 }, // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .docx
    "application/vnd.ms-excel": { maxFileSize: "1MB", maxFileCount: 4 }, // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .xlsx
    "application/vnd.ms-powerpoint": { maxFileSize: "1MB", maxFileCount: 4 }, // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      { maxFileSize: "1MB", maxFileCount: 4 }, // .pptx
    "text/plain": { maxFileSize: "1MB", maxFileCount: 4 }, // .txt

    // Archive types
    "application/gzip": { maxFileSize: "1MB", maxFileCount: 4 },
    "application/zip": { maxFileSize: "1MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url);
    return { uploadedBy: "COLLINZ" };
  }),
  businessLicense: f({
    image: { maxFileSize: "1MB", maxFileCount: 4 },
    pdf: { maxFileSize: "1MB", maxFileCount: 4 },
    "application/msword": { maxFileSize: "1MB", maxFileCount: 4 }, // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .docx
    "application/vnd.ms-excel": { maxFileSize: "1MB", maxFileCount: 4 }, // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .xlsx
    "application/vnd.ms-powerpoint": { maxFileSize: "1MB", maxFileCount: 4 }, // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      { maxFileSize: "1MB", maxFileCount: 4 }, // .pptx
    "text/plain": { maxFileSize: "1MB", maxFileCount: 4 }, // .txt

    // Archive types
    "application/gzip": { maxFileSize: "1MB", maxFileCount: 4 },
    "application/zip": { maxFileSize: "1MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url);
    return { uploadedBy: "COLLINZ" };
  }),
  brandImage: f({ image: { maxFileSize: "1MB" } })
  // Set permissions and file types for this FileRoute
  .onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url, metadata);
    return { uploadedBy: "COLLINZ" };
  }),
  mailAttachments: f({
    image: { maxFileSize: "1MB", maxFileCount: 4 },
    pdf: { maxFileSize: "1MB", maxFileCount: 4 },
    "application/msword": { maxFileSize: "1MB", maxFileCount: 4 }, // .doc
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .docx
    "application/vnd.ms-excel": { maxFileSize: "1MB", maxFileCount: 4 }, // .xls
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": {
      maxFileSize: "1MB",
      maxFileCount: 4,
    }, // .xlsx
    "application/vnd.ms-powerpoint": { maxFileSize: "1MB", maxFileCount: 4 }, // .ppt
    "application/vnd.openxmlformats-officedocument.presentationml.presentation":
      { maxFileSize: "1MB", maxFileCount: 4 }, // .pptx
    "text/plain": { maxFileSize: "1MB", maxFileCount: 4 }, // .txt

    // Archive types
    "application/gzip": { maxFileSize: "1MB", maxFileCount: 4 },
    "application/zip": { maxFileSize: "1MB", maxFileCount: 4 },
  }).onUploadComplete(async ({ metadata, file }) => {
    console.log("file url", file.url);
    return { uploadedBy: "COLLINZ" };
  }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
