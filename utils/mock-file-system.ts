import { FileSystemItem } from '../types/file-system';

export const createMockFileSystem = (): FileSystemItem => {
  return {
    id: 'root',
    name: 'My Projects',
    type: 'folder',
    path: '/Users/username/Projects',
    modified: new Date('2024-01-15'),
    isExpanded: true,
    children: [
      {
        id: 'react-app',
        name: 'react-app',
        type: 'folder',
        path: '/Users/username/Projects/react-app',
        modified: new Date('2024-01-14'),
        isGitRepo: true,
        gitBranch: 'main',
        children: [
          {
            id: 'react-app-src',
            name: 'src',
            type: 'folder',
            path: '/Users/username/Projects/react-app/src',
            modified: new Date('2024-01-14'),
            children: [
              {
                id: 'app-tsx',
                name: 'App.tsx',
                type: 'file',
                path: '/Users/username/Projects/react-app/src/App.tsx',
                size: 2048,
                modified: new Date('2024-01-14'),
                tags: ['component']
              },
              {
                id: 'index-tsx',
                name: 'index.tsx',
                type: 'file',
                path: '/Users/username/Projects/react-app/src/index.tsx',
                size: 512,
                modified: new Date('2024-01-12')
              },
              {
                id: 'components',
                name: 'components',
                type: 'folder',
                path: '/Users/username/Projects/react-app/src/components',
                modified: new Date('2024-01-13'),
                children: [
                  {
                    id: 'header-tsx',
                    name: 'Header.tsx',
                    type: 'file',
                    path: '/Users/username/Projects/react-app/src/components/Header.tsx',
                    size: 1024,
                    modified: new Date('2024-01-13'),
                    tags: ['component', 'ui']
                  },
                  {
                    id: 'sidebar-tsx',
                    name: 'Sidebar.tsx',
                    type: 'file',
                    path: '/Users/username/Projects/react-app/src/components/Sidebar.tsx',
                    size: 1536,
                    modified: new Date('2024-01-13')
                  }
                ]
              }
            ]
          },
          {
            id: 'public',
            name: 'public',
            type: 'folder',
            path: '/Users/username/Projects/react-app/public',
            modified: new Date('2024-01-10'),
            children: [
              {
                id: 'index-html',
                name: 'index.html',
                type: 'file',
                path: '/Users/username/Projects/react-app/public/index.html',
                size: 1280,
                modified: new Date('2024-01-10')
              }
            ]
          },
          {
            id: 'node_modules',
            name: 'node_modules',
            type: 'folder',
            path: '/Users/username/Projects/react-app/node_modules',
            modified: new Date('2024-01-10'),
            children: []
          },
          {
            id: 'package-json',
            name: 'package.json',
            type: 'file',
            path: '/Users/username/Projects/react-app/package.json',
            size: 2560,
            modified: new Date('2024-01-12'),
            tags: ['config']
          },
          {
            id: 'git-folder',
            name: '.git',
            type: 'folder',
            path: '/Users/username/Projects/react-app/.git',
            modified: new Date('2024-01-14'),
            children: []
          }
        ]
      },
      {
        id: 'python-scripts',
        name: 'python-scripts',
        type: 'folder',
        path: '/Users/username/Projects/python-scripts',
        modified: new Date('2024-01-08'),
        children: [
          {
            id: 'data-analysis-py',
            name: 'data_analysis.py',
            type: 'file',
            path: '/Users/username/Projects/python-scripts/data_analysis.py',
            size: 4096,
            modified: new Date('2024-01-08'),
            tags: ['script', 'important']
          },
          {
            id: 'pycache',
            name: '__pycache__',
            type: 'folder',
            path: '/Users/username/Projects/python-scripts/__pycache__',
            modified: new Date('2024-01-07'),
            children: []
          },
          {
            id: 'requirements-txt',
            name: 'requirements.txt',
            type: 'file',
            path: '/Users/username/Projects/python-scripts/requirements.txt',
            size: 256,
            modified: new Date('2024-01-05')
          }
        ]
      },
      {
        id: 'documents',
        name: 'documents',
        type: 'folder',
        path: '/Users/username/Projects/documents',
        modified: new Date('2024-01-03'),
        children: [
          {
            id: 'readme-md',
            name: 'README.md',
            type: 'file',
            path: '/Users/username/Projects/documents/README.md',
            size: 1024,
            modified: new Date('2024-01-03'),
            tags: ['documentation']
          },
          {
            id: 'specs-pdf',
            name: 'specifications.pdf',
            type: 'file',
            path: '/Users/username/Projects/documents/specifications.pdf',
            size: 8192,
            modified: new Date('2024-01-01')
          }
        ]
      }
    ]
  };
};

export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
};

export const getFileExtension = (filename: string): string => {
  return filename.slice(((filename.lastIndexOf('.') - 1) >>> 0) + 2);
};

export const getFileIcon = (item: FileSystemItem): string => {
  if (item.type === 'folder') {
    if (item.name === 'node_modules') return '📦';
    if (item.name === '.git') return '🌿';
    if (item.name === '__pycache__') return '🐍';
    if (item.isGitRepo) return '📁🌿';
    return '📁';
  }
  
  const ext = getFileExtension(item.name);
  switch (ext) {
    case 'tsx':
    case 'jsx':
      return '⚛️';
    case 'js':
    case 'ts':
      return '📜';
    case 'py':
      return '🐍';
    case 'html':
      return '🌐';
    case 'css':
    case 'scss':
      return '🎨';
    case 'json':
      return '📋';
    case 'md':
      return '📖';
    case 'pdf':
      return '📄';
    case 'txt':
      return '📝';
    default:
      return '📄';
  }
};
