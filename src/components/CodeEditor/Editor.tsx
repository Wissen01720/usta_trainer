import React, { useRef, useEffect, useState, useCallback } from 'react';
import * as monaco from 'monaco-editor';
import { Button } from '../ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Play, Save, RefreshCw } from 'lucide-react';

interface EditorProps {
  defaultLanguage?: string;
  defaultCode?: string;
  code?: string;
  theme?: string;
  onCodeChange?: (code: string) => void;
  onRunCode?: (code: string) => void;
}

const Editor: React.FC<EditorProps> = ({
  defaultLanguage = 'javascript',
  defaultCode = '// Start coding here...\n\n',
  code,
  theme = 'vs-dark',
  onCodeChange,
  onRunCode
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const monacoEditorRef = useRef<monaco.editor.IStandaloneCodeEditor | null>(null);
  const [language, setLanguage] = useState(defaultLanguage);

  // Mueve starterCode fuera del componente o usa useMemo si es costoso de calcular
  const starterCode = {
    javascript: `// Create a flying bird animation
function createBird() {
  // This is a simple example - edit and run to see the bird!
  const birdElement = document.createElement('div');
  birdElement.innerHTML = '🦅';
  birdElement.style.fontSize = '2rem';
  birdElement.style.position = 'absolute';
  document.body.appendChild(birdElement);
  
  // Animate the bird
  birdElement.style.animation = 'bird-fly 5s linear infinite';
  return birdElement;
}

// Call the function to create and animate the bird
createBird();`,
    python: `# Create a flying bird animation
# Note: This is a simplified pseudo-code representation

def create_bird():
    # In a real implementation, this would create a visual element
    bird = Bird()
    bird.size = 30
    bird.position = (0, 100)
    
    # Apply animation
    bird.apply_animation("fly", duration=5, repeat=True)
    return bird

# Create and animate the bird
bird = create_bird()`,
    cpp: `// Create a flying bird animation
// Note: This is a simplified pseudo-code representation

#include <iostream>

class Bird {
public:
    Bird(int size = 30) : size_(size) {}
    
    void applyAnimation(const std::string& type) {
        // In a real implementation, this would apply a visual animation
        std::cout << "Bird is now " << type << "ing!" << std::endl;
    }
    
private:
    int size_;
    int position_x_ = 0;
    int position_y_ = 100;
};

int main() {
    // Create a bird instance
    Bird bird(30);
    
    // Apply flying animation
    bird.applyAnimation("fly");
    
    return 0;
}`
  };

  // Envuelve onCodeChange en useCallback si viene del padre
  const handleCodeChange = useCallback((newCode: string) => {
    onCodeChange?.(newCode);
  }, [onCodeChange]);

  // Initialize Monaco editor
  useEffect(() => {
    if (editorRef.current) {
      monacoEditorRef.current = monaco.editor.create(editorRef.current, {
        value: code || starterCode[language as keyof typeof starterCode] || defaultCode,
        language,
        theme: theme || 'vs-dark',
        automaticLayout: true,
        minimap: {
          enabled: false
        },
        scrollBeyondLastLine: false,
        fontSize: 14,
        fontFamily: "'Fira Code', monospace",
        lineNumbers: 'on',
        roundedSelection: true,
        cursorStyle: 'line',
        tabSize: 2,
        lineDecorationsWidth: 0
      });

      monacoEditorRef.current.onDidChangeModelContent(() => {
        if (monacoEditorRef.current) {
          const newCode = monacoEditorRef.current.getValue();
          handleCodeChange(newCode);
        }
      });
    }

    return () => {
      monacoEditorRef.current?.dispose();
    };
  }, [language, code, theme, defaultCode, handleCodeChange]);

  // Handle language change
  const handleLanguageChange = (newLanguage: string) => {
    setLanguage(newLanguage);
    if (monacoEditorRef.current) {
      const model = monacoEditorRef.current.getModel();
      if (model) {
        monaco.editor.setModelLanguage(model, newLanguage);
        if (!code) {
          monacoEditorRef.current.setValue(starterCode[newLanguage as keyof typeof starterCode] || '// Start coding here...\n\n');
        }
      }
    }
  };

  // Update editor when code prop changes
  useEffect(() => {
    if (monacoEditorRef.current && code !== undefined) {
      const currentValue = monacoEditorRef.current.getValue();
      if (code !== currentValue) {
        monacoEditorRef.current.setValue(code);
      }
    }
  }, [code]);

  // Handle run code
  const handleRunCode = useCallback(() => {
    if (monacoEditorRef.current) {
      const currentCode = monacoEditorRef.current.getValue();
      onRunCode?.(currentCode);
    }
  }, [onRunCode]);

  return (
    <div className="flex flex-col h-full">
      <div className="bg-gray-800 text-white p-2 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">Language:</span>
          <Select value={language} onValueChange={handleLanguageChange}>
            <SelectTrigger className="w-32 h-8 text-sm bg-gray-700 border-gray-600">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="javascript">JavaScript</SelectItem>
              <SelectItem value="python">Python</SelectItem>
              <SelectItem value="cpp">C++</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex items-center space-x-2">
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-8 px-3 text-xs"
          >
            <RefreshCw className="h-4 w-4 mr-1" />
            Reset
          </Button>
          <Button 
            size="sm" 
            variant="secondary" 
            className="h-8 px-3 text-xs"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
          <Button 
            size="sm" 
            className="h-8 px-3 text-xs bg-green-500 hover:bg-green-600"
            onClick={handleRunCode}
          >
            <Play className="h-4 w-4 mr-1" />
            Run
          </Button>
        </div>
      </div>
      <div ref={editorRef} className="flex-1"></div>
    </div>
  );
};

export default Editor;