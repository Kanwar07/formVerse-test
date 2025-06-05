import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Camera, MessageCircle, ThumbsUp, Flag } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Comment {
  id: string;
  user: string;
  avatar: string;
  rating: number;
  comment: string;
  printResult: 'success' | 'partial' | 'failed' | null;
  images?: string[];
  timestamp: Date;
  likes: number;
  isHelpful: boolean;
}

interface ModelCommentsProps {
  modelId: string;
  comments?: Comment[];
  onNewComment?: (comment: Omit<Comment, 'id' | 'timestamp' | 'likes' | 'isHelpful'>) => void;
}

export const ModelComments = ({ modelId, comments = [], onNewComment }: ModelCommentsProps) => {
  const [newComment, setNewComment] = useState('');
  const [rating, setRating] = useState(5);
  const [printResult, setPrintResult] = useState<'success' | 'partial' | 'failed' | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  // Demo comments data
  const demoComments: Comment[] = [
    {
      id: '1',
      user: 'Alex Kumar',
      avatar: 'AK',
      rating: 5,
      comment: 'Excellent design! Printed perfectly on my Prusa i3. The tolerances are spot-on and no supports needed.',
      printResult: 'success',
      timestamp: new Date('2024-01-15'),
      likes: 12,
      isHelpful: true
    },
    {
      id: '2',
      user: 'Sarah Chen',
      avatar: 'SC',
      rating: 4,
      comment: 'Great functional part. Had to scale it down 5% for my application but works perfectly now. Would recommend for prototyping.',
      printResult: 'success',
      timestamp: new Date('2024-01-10'),
      likes: 8,
      isHelpful: true
    },
    {
      id: '3',
      user: 'Mike Rodriguez',
      avatar: 'MR',
      rating: 3,
      comment: 'The design is good but had some issues with overhangs. Needed to add supports for a clean print.',
      printResult: 'partial',
      timestamp: new Date('2024-01-08'),
      likes: 3,
      isHelpful: false
    }
  ];

  const allComments = [...demoComments, ...comments];

  const handleSubmitComment = async () => {
    if (!newComment.trim()) {
      toast({
        title: "Comment required",
        description: "Please write a comment before submitting.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const comment: Omit<Comment, 'id' | 'timestamp' | 'likes' | 'isHelpful'> = {
      user: 'You',
      avatar: 'YO',
      rating,
      comment: newComment,
      printResult
    };

    // Store comment data
    const existingComments = JSON.parse(localStorage.getItem(`comments_${modelId}`) || '[]');
    existingComments.push({
      ...comment,
      id: Date.now().toString(),
      timestamp: new Date(),
      likes: 0,
      isHelpful: false
    });
    localStorage.setItem(`comments_${modelId}`, JSON.stringify(existingComments));

    if (onNewComment) {
      onNewComment(comment);
    }

    toast({
      title: "Comment added!",
      description: "Thank you for sharing your experience.",
    });

    setNewComment('');
    setRating(5);
    setPrintResult(null);
    setIsSubmitting(false);
  };

  const getPrintResultBadge = (result: string | null) => {
    if (!result) return null;
    
    const variants = {
      success: { label: 'Print Success', variant: 'default' as const, color: 'bg-green-500' },
      partial: { label: 'Partial Success', variant: 'secondary' as const, color: 'bg-yellow-500' },
      failed: { label: 'Print Failed', variant: 'destructive' as const, color: 'bg-red-500' }
    };

    const config = variants[result as keyof typeof variants];
    return (
      <Badge variant={config.variant} className="text-xs">
        <div className={`w-2 h-2 rounded-full mr-1 ${config.color}`} />
        {config.label}
      </Badge>
    );
  };

  const renderStars = (rating: number) => (
    <div className="flex">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`h-4 w-4 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
        />
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Community Feedback ({allComments.length})
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Add new comment */}
          <div className="border rounded-lg p-4 bg-muted/30">
            <h4 className="font-medium mb-3">Share Your Experience</h4>
            <div className="space-y-3">
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Rating:</span>
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-4 w-4 cursor-pointer ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`}
                        onClick={() => setRating(star)}
                      />
                    ))}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">Print Result:</span>
                  <Select value={printResult || ''} onValueChange={(value) => setPrintResult(value as any)}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Select result" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="success">Success</SelectItem>
                      <SelectItem value="partial">Partial Success</SelectItem>
                      <SelectItem value="failed">Failed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Textarea
                placeholder="Share your printing experience, tips, or feedback..."
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                className="min-h-[80px]"
              />

              <div className="flex justify-between items-center">
                <div className="text-xs text-muted-foreground flex items-center gap-1">
                  <Camera className="h-3 w-3" />
                  Photo uploads coming soon
                </div>
                <Button onClick={handleSubmitComment} disabled={isSubmitting}>
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </div>
          </div>

          {/* Existing comments */}
          <div className="space-y-4">
            {allComments.map((comment) => (
              <div key={comment.id} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="text-xs">{comment.avatar}</AvatarFallback>
                  </Avatar>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-sm">{comment.user}</span>
                        {renderStars(comment.rating)}
                        {getPrintResultBadge(comment.printResult)}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {comment.timestamp.toLocaleDateString()}
                      </span>
                    </div>
                    
                    <p className="text-sm">{comment.comment}</p>
                    
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <ThumbsUp className="h-3 w-3" />
                        {comment.likes}
                      </button>
                      <button className="flex items-center gap-1 hover:text-foreground">
                        <Flag className="h-3 w-3" />
                        Report
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
