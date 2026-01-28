import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Textarea } from "@/components/ui/textarea";
import { Plus, Save, StickyNote } from "lucide-react";
import { useState } from "react";

interface Note {
  id: string;
  content: string;
  timestamp: string;
  author: string;
}

interface NotesWidgetProps {
  notes: Note[];
  onAddNote?: (content: string) => void;
}

export function NotesWidget({ notes, onAddNote }: NotesWidgetProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [newNote, setNewNote] = useState("");

  const handleSave = () => {
    if (newNote.trim() && onAddNote) {
      onAddNote(newNote);
      setNewNote("");
      setIsAdding(false);
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <StickyNote className="h-4 w-4" />
            Notes
          </CardTitle>
          {!isAdding && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsAdding(true)}
              className="h-7 text-xs"
            >
              <Plus className="h-3.5 w-3.5 mr-1" />
              Add
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {/* Add Note Form */}
          {isAdding && (
            <div className="space-y-2 p-2.5 border rounded-md bg-muted/30">
              <Textarea
                placeholder="Write a note..."
                value={newNote}
                onChange={(e) => setNewNote(e.target.value)}
                className="min-h-[80px] text-sm resize-none"
                autoFocus
              />
              <div className="flex gap-2">
                <Button size="sm" onClick={handleSave} className="h-7 text-xs">
                  <Save className="h-3.5 w-3.5 mr-1" />
                  Save
                </Button>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => {
                    setIsAdding(false);
                    setNewNote("");
                  }}
                  className="h-7 text-xs"
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}

          {/* Notes List */}
          {notes.length === 0 ? (
            <div className="text-center py-6 text-sm text-muted-foreground">
              No notes yet
            </div>
          ) : (
            <ScrollArea className="h-[200px] -mx-2 px-2">
              <div className="space-y-2.5">
                {notes.map((note) => (
                  <div
                    key={note.id}
                    className="p-2.5 rounded-md border bg-muted/30 space-y-1.5"
                  >
                    <p className="text-xs leading-relaxed">{note.content}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="font-medium">{note.author}</span>
                      <span>•</span>
                      <span>{note.timestamp}</span>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
