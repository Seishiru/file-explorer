import React from 'react';
import { Bookmark, X, Folder } from 'lucide-react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { BookmarkedFolder } from '../types/file-system';

interface BookmarkPanelProps {
  bookmarks: BookmarkedFolder[];
  onBookmarkClick: (bookmark: BookmarkedFolder) => void;
  onRemoveBookmark: (bookmarkId: string) => void;
}

export const BookmarkPanel: React.FC<BookmarkPanelProps> = ({
  bookmarks,
  onBookmarkClick,
  onRemoveBookmark
}) => {
  return (
    <Card className="h-fit">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Bookmark className="h-5 w-5" style={{ color: 'var(--accent-color)' }} />
          Bookmarks
        </CardTitle>
      </CardHeader>
      <CardContent>
        {bookmarks.length > 0 ? (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {bookmarks.map((bookmark) => (
              <div
                key={bookmark.id}
                className="flex items-center justify-between p-2 rounded-md border bg-card hover:bg-accent cursor-pointer group"
                onClick={() => onBookmarkClick(bookmark)}
              >
                <div className="flex items-center gap-2 flex-1 min-w-0">
                  <Folder className="h-4 w-4" style={{ color: 'var(--accent-color)' }} />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium truncate">{bookmark.name}</div>
                    <div className="text-xs text-muted-foreground truncate">{bookmark.path}</div>
                  </div>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveBookmark(bookmark.id);
                  }}
                  size="sm"
                  variant="ghost"
                  className="p-1 h-6 w-6 opacity-0 group-hover:opacity-100"
                >
                  <X className="h-3 w-3" />
                </Button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-4 text-sm text-muted-foreground">
            <Bookmark className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p>No bookmarks yet</p>
            <p className="text-xs mt-1">Right-click folders to bookmark them</p>
            <p className="text-xs mt-1 text-accent-color/70">Press Ctrl+D to bookmark current folder</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
