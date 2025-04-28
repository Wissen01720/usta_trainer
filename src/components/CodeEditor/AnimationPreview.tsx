import React, { useRef, useEffect } from 'react';

interface AnimationPreviewProps {
  code?: string;
  language: string;
}

const AnimationPreview: React.FC<AnimationPreviewProps> = ({ code = '', language }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const iframeRef = useRef<HTMLIFrameElement>(null);

  // Function to create and inject HTML content safely into the iframe
  const createAndInjectContent = (content: string) => {
    if (iframeRef.current) {
      // Create a blob with the HTML content
      const blob = new Blob([content], { type: 'text/html' });
      const url = URL.createObjectURL(blob);
      
      // Set the iframe src to the blob URL
      iframeRef.current.src = url;
      
      // Clean up the URL object when done
      return () => {
        URL.revokeObjectURL(url);
      };
    }
    return () => {};
  };

  // Generate HTML for JavaScript animation
  const generateJavaScriptHTML = (jsCode: string) => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
              color: #0f172a;
              font-family: 'Inter', sans-serif;
              height: 100vh;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            @keyframes bird-fly {
              0% { transform: translateX(-100%) translateY(0); }
              25% { transform: translateX(-50%) translateY(-30px); }
              50% { transform: translateX(0%) translateY(0); }
              75% { transform: translateX(50%) translateY(-30px); }
              100% { transform: translateX(100%) translateY(0); }
            }
          </style>
        </head>
        <body>
          <script>
            try {
              ${jsCode}
            } catch(error) {
              const errorDiv = document.createElement('div');
              errorDiv.style.color = 'red';
              errorDiv.style.padding = '10px';
              errorDiv.style.fontFamily = 'monospace';
              errorDiv.textContent = 'Error: ' + error.message;
              document.body.appendChild(errorDiv);
            }
          </script>
        </body>
      </html>
    `;
  };

  // Generate HTML for Python simulation
  const generatePythonHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
              color: #0f172a;
              font-family: 'Inter', sans-serif;
              height: 100vh;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            @keyframes bird-fly {
              0% { transform: translateX(-100%) translateY(0); }
              25% { transform: translateX(-50%) translateY(-30px); }
              50% { transform: translateX(0%) translateY(0); }
              75% { transform: translateX(50%) translateY(-30px); }
              100% { transform: translateX(100%) translateY(0); }
            }
            .bird {
              font-size: 3rem;
              position: absolute;
              animation: bird-fly 7s linear infinite;
              top: 100px;
            }
            .message {
              margin-top: 200px;
              font-family: monospace;
              color: #0ea5e9;
            }
          </style>
        </head>
        <body>
          <div class="bird">🦜</div>
          <div class="message">Running Python simulation...<br>Bird animation created!</div>
        </body>
      </html>
    `;
  };

  // Generate HTML for C++ simulation
  const generateCppHTML = () => {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body {
              margin: 0;
              padding: 0;
              background-color: #f8fafc;
              color: #0f172a;
              font-family: 'Inter', sans-serif;
              height: 100vh;
              overflow: hidden;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
            }
            @keyframes bird-fly {
              0% { transform: translateX(-100%) translateY(0); }
              25% { transform: translateX(-50%) translateY(-30px); }
              50% { transform: translateX(0%) translateY(0); }
              75% { transform: translateX(50%) translateY(-30px); }
              100% { transform: translateX(100%) translateY(0); }
            }
            .bird {
              font-size: 3rem;
              position: absolute;
              animation: bird-fly 10s linear infinite;
              top: 100px;
            }
            .message {
              margin-top: 200px;
              font-family: monospace;
              color: #a855f7;
            }
          </style>
        </head>
        <body>
          <div class="bird">🦅</div>
          <div class="message">C++ Output:<br>Bird is now flying!</div>
        </body>
      </html>
    `;
  };

  // Execute code based on language
  useEffect(() => {
    if (!code) return;
  
    // Inicializa cleanup con una función vacía
    let cleanup: () => void = () => {};
  
    switch (language) {
      case 'javascript':
        cleanup = createAndInjectContent(generateJavaScriptHTML(code));
        break;
      case 'python':
        cleanup = createAndInjectContent(generatePythonHTML());
        break;
      case 'cpp':
        cleanup = createAndInjectContent(generateCppHTML());
        break;
      default:
        console.warn(`Unsupported language: ${language}`);
    }
  
    return cleanup;
  }, [code, language]);

  return (
    <div 
      ref={containerRef} 
      className="h-full bg-white dark:bg-gray-900 rounded-lg overflow-hidden relative"
    >
      <div className="bg-gray-800 text-white p-2 text-sm font-medium">
        Animation Preview
      </div>
      <iframe 
        ref={iframeRef}
        title="animation-preview"
        className="w-full h-[calc(100%-2.5rem)] border-0"
        sandbox="allow-scripts"
      />
    </div>
  );
};

export default AnimationPreview;