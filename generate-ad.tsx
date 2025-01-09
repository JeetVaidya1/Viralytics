'use client';
import React, { useState } from 'react';
import { ClipLoader } from 'react-spinners';

export default function GenerateAd() {
  const [product, setProduct] = useState('');
  const [tone, setTone] = useState('Professional');
  const [audience, setAudience] = useState('General');
  const [length, setLength] = useState('Short');
  const [style, setStyle] = useState('Realistic');
  const [ad, setAd] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Generate Ad Text
      const adResponse = await fetch('http://localhost:5001/generate-ad', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ product, tone, audience, length }),
      });
      const adData = await adResponse.json();
      setAd(adData.ad);

      // Generate Multiple Images
      const imageResponse = await fetch('http://localhost:5001/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: product, style, count: 3 }),
      });
      const imageData = await imageResponse.json();
      setImages(imageData.imageUrls || []);
    } catch (err: unknown) {
      console.error('Error:', err);
      setError('Failed to generate ad or images!');
    } finally {
      setLoading(false);
    }
  };

  const regenerateImage = async (index: number) => {
    if (!product) return;

    setLoading(true);
    setError('');

    try {
      const imageResponse = await fetch('http://localhost:5001/generate-image', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: product, style }),
      });
      const imageData = await imageResponse.json();
      const newImages = [...images];
      newImages[index] = imageData.imageUrl;
      setImages(newImages);
    } catch (err: unknown) {
      console.error('Error:', err);
      setError('Failed to regenerate image!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: 'Poppins, sans-serif',
      color: '#fff',
    }}>
      {/* Left Section */}
      <div style={{
        flex: 1,
        padding: '40px',
        background: '#1a1a2e',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        boxShadow: '10px 0 20px rgba(0, 0, 0, 0.8)',
      }}>
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: '700',
          color: '#00d4ff',
          textAlign: 'center',
          marginBottom: '20px',
        }}>Viralytics <span style={{ color: '#40c9ff' }}>AI Ad Generator</span></h1>

        <form onSubmit={handleGenerate} style={{ width: '100%', maxWidth: '400px' }}>
          <input
            type="text"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            placeholder="Enter Product Description..."
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '8px',
              marginBottom: '15px',
              fontSize: '16px',
              border: '1px solid #00d4ff',
              background: '#0f3460',
              color: '#fff',
              outline: 'none',
            }}
          />

          {/* Dropdowns */}
          <select value={tone} onChange={(e) => setTone(e.target.value)} style={{ marginBottom: '10px', padding: '10px' }}>
            <option>Professional</option>
            <option>Casual</option>
            <option>Witty</option>
          </select>
          <select value={audience} onChange={(e) => setAudience(e.target.value)} style={{ marginBottom: '10px', padding: '10px' }}>
            <option>General</option>
            <option>Teens</option>
            <option>Professionals</option>
            <option>Parents</option>
          </select>
          <select value={length} onChange={(e) => setLength(e.target.value)} style={{ marginBottom: '10px', padding: '10px' }}>
            <option>Short</option>
            <option>Medium</option>
            <option>Long</option>
          </select>
          <select value={style} onChange={(e) => setStyle(e.target.value)} style={{ marginBottom: '10px', padding: '10px' }}>
            <option>Realistic</option>
            <option>Artistic</option>
            <option>Minimalistic</option>
          </select>

          <button
            type="submit"
            style={{
              width: '100%',
              padding: '15px',
              borderRadius: '8px',
              background: '#00d4ff',
              color: '#1a1a2e',
              fontSize: '16px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: '0.3s',
              boxShadow: '0 4px 10px rgba(0, 212, 255, 0.6)',
            }}>
            {loading ? <ClipLoader color="#fff" size={15} /> : 'Generate Ad'}
          </button>
        </form>

        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
      </div>

      {/* Right Section */}
      <div style={{
        flex: 1,
        padding: '40px',
        background: 'linear-gradient(135deg, #240b36, #c31432)',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        {ad && (
          <textarea
            value={ad}
            onChange={(e) => setAd(e.target.value)}
            style={{ width: '100%', height: '150px', marginBottom: '15px', padding: '10px' }}
          />
        )}

        {images && images.length > 0 && images.map((img, index) => (
          <div key={index} style={{ marginBottom: '10px' }}>
            <img src={img} alt={`Generated ${index + 1}`} style={{ width: '100%', maxHeight: '200px' }} />
            <button onClick={() => regenerateImage(index)} style={{ marginTop: '5px', padding: '10px', borderRadius: '8px', cursor: 'pointer' }}>Regenerate</button>
          </div>
        ))}
      </div>
    </div>
  );
}
