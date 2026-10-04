import path from "node:path";
import fs from "node:fs";
import { fileURLToPath } from "node:url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const legacyDocumentsRoot = path.resolve(__dirname, "../pStudayWare/Documents");

const legacyDocumentsPlugin = () => ({
  name: "legacy-documents",
  configureServer(server) {
    server.middlewares.use((req, res, next) => {
      const rawUrl = req.url?.split("?")[0] ?? "";
      const prefix = "/pstudyware/Documents/";
      if (!rawUrl.startsWith(prefix)) {
        return next();
      }

      const relativePath = decodeURIComponent(rawUrl.slice(prefix.length));
      if (!relativePath || relativePath.includes("..")) {
        return next();
      }

      const filePath = path.resolve(legacyDocumentsRoot, relativePath);
      if (
        !filePath.startsWith(legacyDocumentsRoot) ||
        !fs.existsSync(filePath)
      ) {
        return next();
      }

      const stat = fs.statSync(filePath);
      if (!stat.isFile()) {
        return next();
      }

      const ext = path.extname(filePath).toLowerCase();
      const contentType =
        ext === ".pdf"
          ? "application/pdf"
          : ext === ".doc"
            ? "application/msword"
            : ext === ".docx"
              ? "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
              : "application/octet-stream";

      res.statusCode = 200;
      res.setHeader("Content-Type", contentType);
      res.setHeader("Content-Length", stat.size);
      fs.createReadStream(filePath).pipe(res);
    });
  },
});

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), legacyDocumentsPlugin()],
  resolve: {
    alias: [
      // pdfjs-dist 5's modern build calls Promise.withResolvers() unpolyfilled,
      // which older phone browsers (iOS Safari < 17.4, Chrome < 119) lack — react-pdf
      // then fails and the viewer drops to a native iframe that doesn't work on
      // mobile. The legacy build ships the polyfills; worker is matched in PdfViewer.
      { find: /^pdfjs-dist$/, replacement: "pdfjs-dist/legacy/build/pdf.mjs" },
    ],
  },
  optimizeDeps: {
    include: ["pdfjs-dist/legacy/build/pdf.mjs"],
  },
  build: {
    rollupOptions: {
      output: {
        // IIS has no MIME type for .mjs and answers 404 for it, which kills the PDF
        // viewer's worker (pdf.worker.min-*.mjs) on the deployed site. The server's
        // web.config is managed outside git, so emit the worker as .js instead.
        assetFileNames: (assetInfo) =>
          assetInfo.names?.some((name) => name.endsWith(".mjs"))
            ? "assets/[name]-[hash].js"
            : "assets/[name]-[hash][extname]",
      },
    },
  },
  server: {
    port: 3000,
    host: true,
    proxy: {
      "/api": {
        target: "http://localhost:5281",
        changeOrigin: true,
        secure: false,
      },
    },
  },
});
