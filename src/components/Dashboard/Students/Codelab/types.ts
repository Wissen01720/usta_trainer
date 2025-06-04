export interface Exercise {
  id: number;
  title: string;
  description: string;
  input_example: string;
  output_example: string;
  test_cases?: Array<{
    input_data: string;
    expected_output: string;
  }>;
}

export interface SubmissionResult {
  passed: boolean;
  result: string;
  details: Array<{
    input: string;
    expected: string;
    actual: string;
    verdict: string;
  }>;
  message: string;
}

export interface CodeEditorProps {
  code: string;
  onChange: (code: string) => void;
  language: string;
  theme: string;
}