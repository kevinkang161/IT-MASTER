export interface VideoChapter {
  time: string;
  seconds: number;
  title: string;
}

export interface VideoExercise {
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface VideoItem {
  id: string;
  grade: string;
  track: string;
  title: string;
  url: string;
  chapters?: VideoChapter[];
  exercises?: VideoExercise[];
}
