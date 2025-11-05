import { PdfLocker } from "@/components/pdf-locker";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 bg-gray-50 dark:bg-gray-900">
      <div className="w-full max-w-2xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 dark:text-gray-50">
            Secure PDF Locker
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Client-side PDF encryption and decryption using AES-256.
          </p>
        </div>
        <PdfLocker />
        <footer className="text-center mt-8 text-sm text-gray-500">
          <p>&copy; {new Date().getFullYear()} Secure PDF Locker. All files are processed in your browser. We do not upload your files to our servers.</p>
        </footer>
      </div>
    </main>
  );
}
