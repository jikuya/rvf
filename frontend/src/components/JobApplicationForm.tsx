import React, { useState } from 'react';
import { useParams } from 'react-router-dom';

interface JobApplicationFormProps {
  onSubmit: () => void;
}

const JobApplicationForm: React.FC<JobApplicationFormProps> = ({ onSubmit }) => {
  const { jobId } = useParams<{ jobId: string }>();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    resume: null as File | null,
  });
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    if (formData.resume) {
      data.append('resume', formData.resume);
    }

    try {
      const response = await fetch(`/api/jobs/${jobId}/job_applications`, {
        method: 'POST',
        body: data,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.errors?.join(', ') || '応募の送信に失敗しました');
      }

      onSubmit();
      setFormData({ name: '', email: '', resume: null });
    } catch (err) {
      setError(err instanceof Error ? err.message : '応募の送信に失敗しました');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6">応募フォーム</h2>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}

      <div className="mb-4">
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          お名前
        </label>
        <input
          type="text"
          id="name"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          メールアドレス
        </label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div className="mb-6">
        <label htmlFor="resume" className="block text-sm font-medium text-gray-700 mb-1">
          履歴書
        </label>
        <input
          type="file"
          id="resume"
          name="resume"
          onChange={handleChange}
          required
          accept=".pdf,.doc,.docx"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <p className="mt-1 text-sm text-gray-500">
          PDF、Wordファイル（.doc、.docx）がアップロード可能です
        </p>
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        応募する
      </button>
    </form>
  );
};

export default JobApplicationForm; 