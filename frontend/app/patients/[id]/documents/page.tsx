'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { documentAPI } from '@/lib/api';
import AuthGuard from '@/components/AuthGuard';

interface Document {
  id: number;
  document_type: string;
  file_name: string;
  file_path: string;
  created_at: string;
}

export default function PatientDocumentsPage() {
  const params = useParams();
  const router = useRouter();
  const patientId = params.id as string;
  
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpload, setShowUpload] = useState(false);
  const [uploadData, setUploadData] = useState({
    document_type: '',
    file: null as File | null,
  });
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    loadDocuments();
  }, [patientId]);

  const loadDocuments = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await documentAPI.getByPatient(patientId);
      setDocuments(response.data.documents || []);
    } catch (err: any) {
      console.error('Failed to load documents:', err);
      setError(err.response?.data?.error || 'Failed to load documents');
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!uploadData.file) {
      setError('Please select a file');
      return;
    }

    setError('');
    setUploading(true);

    try {
      const formData = new FormData();
      formData.append('document', uploadData.file);
      formData.append('document_type', uploadData.document_type);

      await documentAPI.upload(patientId, formData);
      setShowUpload(false);
      setUploadData({ document_type: '', file: null });
      loadDocuments();
    } catch (err: any) {
      console.error('Failed to upload document:', err);
      setError(err.response?.data?.error || 'Failed to upload document');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (docId: number) => {
    if (!confirm('Are you sure you want to delete this document?')) return;

    try {
      await documentAPI.delete(docId.toString());
      loadDocuments();
    } catch (err: any) {
      console.error('Failed to delete document:', err);
      alert(err.response?.data?.error || 'Failed to delete document');
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <AuthGuard>
      <div className="min-h-screen bg-[#faf6f0] py-8 relative overflow-hidden">
        {/* Blurred background decorations */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-0 right-0 w-96 h-96 bg-[#ede0d0] rounded-full blur-3xl opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-[#e5d5c3] rounded-full blur-3xl opacity-40"></div>
          <div className="absolute top-1/2 left-1/2 w-96 h-96 bg-[#f2e6d9] rounded-full blur-3xl opacity-50"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="mb-6 flex justify-between items-center">
            <div>
              <button
                onClick={() => router.back()}
                className="text-[#8c4a35] hover:text-[#5a2e1e] mb-4 font-semibold transition-colors hover:bg-white/50 px-3 py-1 rounded-lg backdrop-blur-sm"
              >
                ← Back
              </button>
              <h1 className="text-4xl font-bold text-[#4a2e1e] drop-shadow-sm">
                Medical Documents
              </h1>
            </div>
            <button
              onClick={() => setShowUpload(true)}
              className="bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-semibold"
            >
              Upload Document
            </button>
          </div>

          {error && (
            <div className="bg-[#fbf0ea] border border-[#ede0d0] text-[#8c4a35] px-4 py-3 rounded-xl mb-6 backdrop-blur-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="text-center py-12 text-[#8c4a35]">Loading...</div>
          ) : documents.length === 0 ? (
            <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-12 text-center">
              <div className="text-6xl mb-6">📄</div>
              <h2 className="text-2xl font-bold text-[#4a2e1e] mb-4">No Documents</h2>
              <p className="text-[#7c6a5a] mb-6">Upload medical documents to keep them organized</p>
              <button
                onClick={() => setShowUpload(true)}
                className="inline-block bg-[#8c4a35] hover:bg-[#723a28] text-white px-8 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-semibold"
              >
                Upload Document
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {documents.map((doc) => (
                <div
                  key={doc.id}
                  className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-sm border border-[#ede0d0] p-6 hover:border-[#8c4a35]/40 hover:shadow-md transition-all"
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1">
                      <h3 className="font-semibold text-[#4a2e1e] text-lg mb-1">{doc.file_name}</h3>
                      <p className="text-sm text-[#7c6a5a] capitalize">{doc.document_type}</p>
                      <p className="text-xs text-[#8c7464] mt-2">{formatDate(doc.created_at)}</p>
                    </div>
                    <button
                      onClick={() => handleDelete(doc.id)}
                      className="text-[#8c4a35] hover:text-[#5a2e1e] text-sm font-semibold px-2 py-1 rounded-lg hover:bg-[#fbf0ea] transition-all"
                    >
                      Delete
                    </button>
                  </div>
                  <a
                    href={`${process.env.NEXT_PUBLIC_API_URL}/documents/${doc.id}/download`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block text-[#8c4a35] hover:text-[#5a2e1e] text-sm font-semibold"
                  >
                    View Document →
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Upload Modal */}
        {showUpload && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-white/95 backdrop-blur-xl rounded-2xl shadow-2xl max-w-md w-full border border-[#ede0d0] relative overflow-hidden">
              <div className="relative z-10 p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-[#4a2e1e]">
                    Upload Document
                  </h2>
                  <button
                    onClick={() => {
                      setShowUpload(false);
                      setError('');
                      setUploadData({ document_type: '', file: null });
                    }}
                    className="text-[#7c6a5a] hover:text-[#4a2e1e] transition-colors"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>

                <form onSubmit={handleUpload} className="space-y-4">
                  <div>
                    <label htmlFor="document_type" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                      Document Type *
                    </label>
                    <select
                      id="document_type"
                      required
                      className="w-full px-4 py-3 border border-[#ede0d0] rounded-xl bg-white/70 backdrop-blur-sm text-[#4a2e1e] focus:outline-none focus:ring-2 focus:ring-[#8c4a35]"
                      value={uploadData.document_type}
                      onChange={(e) => setUploadData({ ...uploadData, document_type: e.target.value })}
                    >
                      <option value="">Select type</option>
                      <option value="prescription">Prescription</option>
                      <option value="lab_report">Lab Report</option>
                      <option value="medical_record">Medical Record</option>
                      <option value="insurance">Insurance</option>
                      <option value="other">Other</option>
                    </select>
                  </div>

                  <div>
                    <label htmlFor="file" className="block text-sm font-semibold text-[#4a2e1e] mb-2">
                      File * (JPEG, PNG, PDF - Max 10MB)
                    </label>
                    <input
                      type="file"
                      id="file"
                      required
                      accept=".jpeg,.jpg,.png,.pdf"
                      className="w-full px-4 py-3 border border-[#ede0d0] rounded-xl bg-white/70 backdrop-blur-sm text-[#4a2e1e] focus:outline-none focus:ring-2 focus:ring-[#8c4a35]"
                      onChange={(e) => setUploadData({ ...uploadData, file: e.target.files?.[0] || null })}
                    />
                  </div>

                  <div className="flex gap-3 pt-4">
                    <button
                      type="submit"
                      disabled={uploading}
                      className="flex-1 bg-[#8c4a35] hover:bg-[#723a28] text-white px-6 py-3 rounded-xl transition-all shadow-sm hover:shadow-md font-semibold disabled:opacity-50"
                    >
                      {uploading ? 'Uploading...' : 'Upload'}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
}

