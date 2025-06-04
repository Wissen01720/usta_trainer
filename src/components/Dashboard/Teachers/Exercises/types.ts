export interface TestCase {
  id: number;
  input_data: string;
  expected_output: string;
  problem_id: number;
}

export interface Problem {
  id: number;
  title: string;
  description: string;
  input_example: string;
  output_example: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  test_cases?: TestCase[];
}

export interface ProblemForm {
  title: string;
  description: string;
  input_example: string;
  output_example: string;
  difficulty: "easy" | "medium" | "hard";
  tags: string[];
  newTag: string;
}