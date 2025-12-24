import { Injectable, signal } from '@angular/core';

export interface Comment {
  id: string;
  author: string;
  text: string;
  date: Date;
}

export interface CommunityNote {
  id: string;
  title: string;
  author: string;
  preview: string;
  content: string; // Full content for reading mode
  tags: string[];
  likes: number;
  saves: number;
  views: number;
  date: Date;
  isLiked?: boolean;
  isSaved?: boolean;
  comments: Comment[];
  groupId?: string; // Optional: associated with a specific group
  visibility: 'public' | 'class' | 'private';
}

export interface Group {
  id: string;
  name: string;
  description: string;
  memberCount: number;
  isJoined?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class CommunityService {
  posts = signal<CommunityNote[]>([
    {
       id: 'c1',
       title: 'AP Biology - Cell Respiration Complete Guide',
       author: 'Sarah Jenkins',
       preview: 'Detailed breakdown of Glycolysis, Krebs Cycle, and ETC. Includes diagrams and mnemonics.',
       content: "# AP Biology: Cell Respiration\n\n## 1. Glycolysis\nOccurs in the cytoplasm. Breaks glucose into 2 pyruvate molecules.\n\n## 2. Krebs Cycle\nOccurs in the mitochondrial matrix. Generates NADH and FADH2.\n\n## 3. ETC\nOxidative phosphorylation. Generates most ATP.",
       tags: ['Biology', 'AP', 'Exam Prep'],
       likes: 124,
       saves: 45,
       views: 1205,
       date: new Date('2024-05-15'),
       comments: [
         { id: 'cm1', author: 'Mark', text: 'This saved my life for the midterm!', date: new Date('2024-05-16') },
         { id: 'cm2', author: 'Dr. Lee', text: 'Great summary of the ETC.', date: new Date('2024-05-16') }
       ],
       visibility: 'public'
    },
    {
       id: 'c2',
       title: 'Calculus I - Derivatives Cheat Sheet',
       author: 'Mike Chen',
       preview: 'All common derivative rules (Power, Chain, Product, Quotient) on one page.',
       content: "# Calculus Derivatives\n\n- **Power Rule:** d/dx(x^n) = nx^(n-1)\n- **Product Rule:** d/dx(uv) = u'v + uv'\n- **Quotient Rule:** d/dx(u/v) = (u'v - uv') / v^2\n- **Chain Rule:** d/dx(f(g(x))) = f'(g(x)) * g'(x)",
       tags: ['Math', 'Calculus', 'Cheat Sheet'],
       likes: 89,
       saves: 210,
       views: 3400,
       date: new Date('2024-05-18'),
       comments: [],
       visibility: 'public'
    },
    {
       id: 'c3',
       title: 'History of Europe 1914-1945',
       author: 'HistoryBuff_99',
       preview: 'Timeline of major events from WWI to WWII. Focus on causes and effects.',
       content: "# European History Timeline\n\n- **1914:** Assassination of Archduke Franz Ferdinand\n- **1919:** Treaty of Versailles\n- **1933:** Hitler becomes Chancellor\n- **1939:** Invasion of Poland",
       tags: ['History', 'Europe', 'Timeline'],
       likes: 56,
       saves: 12,
       views: 600,
       date: new Date('2024-05-20'),
       comments: [],
       groupId: 'g1', // Linked to History Club
       visibility: 'public'
    }
  ]);

  groups = signal<Group[]>([
    { id: 'g1', name: 'History Club', description: 'For all things history.', memberCount: 156, isJoined: false },
    { id: 'g2', name: 'AP Bio Study Group', description: 'Exam prep and moral support.', memberCount: 89, isJoined: false },
    { id: 'g3', name: 'Calc BC Survivors', description: 'We function together.', memberCount: 42, isJoined: false }
  ]);

  publishNote(note: Partial<CommunityNote>) {
    const newNote: CommunityNote = {
      id: crypto.randomUUID(),
      title: note.title || 'Untitled',
      author: note.author || 'Anonymous',
      preview: note.content ? note.content.substring(0, 100) + '...' : 'No preview',
      content: note.content || '',
      tags: note.tags || [],
      likes: 0,
      saves: 0,
      views: 0,
      date: new Date(),
      comments: [],
      groupId: note.groupId,
      visibility: note.visibility || 'public'
    };
    
    this.posts.update(p => [newNote, ...p]);
  }

  addComment(noteId: string, author: string, text: string) {
    this.posts.update(posts => posts.map(p => {
      if (p.id === noteId) {
        return {
          ...p,
          comments: [...p.comments, { id: crypto.randomUUID(), author, text, date: new Date() }]
        };
      }
      return p;
    }));
  }

  toggleLike(id: string) {
     this.posts.update(posts => posts.map(p => {
        if (p.id === id) {
           return { 
              ...p, 
              likes: p.isLiked ? p.likes - 1 : p.likes + 1,
              isLiked: !p.isLiked
           };
        }
        return p;
     }));
  }

  toggleSave(id: string) {
     this.posts.update(posts => posts.map(p => {
        if (p.id === id) {
           return { 
              ...p, 
              saves: p.isSaved ? p.saves - 1 : p.saves + 1,
              isSaved: !p.isSaved
           };
        }
        return p;
     }));
  }

  incrementView(id: string) {
    this.posts.update(posts => posts.map(p => {
      if (p.id === id) return { ...p, views: p.views + 1 };
      return p;
    }));
  }

  joinGroup(id: string) {
    this.groups.update(gs => gs.map(g => {
      if (g.id === id) return { ...g, isJoined: !g.isJoined, memberCount: g.isJoined ? g.memberCount - 1 : g.memberCount + 1 };
      return g;
    }));
  }
}