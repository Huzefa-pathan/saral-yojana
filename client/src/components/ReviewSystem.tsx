import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, User } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface Review {
  id: string;
  username: string;
  message: string;
  timestamp: number;
}
export function ReviewSystem() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const fetchReviews = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reviews");
      if (!response.ok) {
        throw new Error("Failed to fetch reviews");
      }
      const data = (await response.json()) as Review[];
      setReviews(data);
    } catch (err) {
      console.error(err);
      setError("Could not load reviews.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void fetchReviews();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) {
      setError("Message cannot be empty.");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/reviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, message }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit review.");
      }

      setUsername("");
      setMessage("");
      await fetchReviews();
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-8">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl">Leave a review</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="text-sm font-medium text-gray-700">
                Username (optional)
              </label>
              <Input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Your name"
                className="mt-1"
                disabled={isSubmitting}
              />
            </div>
            <div>
              <label htmlFor="message" className="text-sm font-medium text-gray-700">
                Your feedback
              </label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share your experience with this site"
                rows={4}
                className="mt-1"
                required
                disabled={isSubmitting}
              />
            </div>
            {error && <p className="text-sm text-red-500">{error}</p>}
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Submitting...
                </>
              ) : (
                "Submit feedback"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-3xl font-bold text-gray-900 pt-4">User Reviews</h2>
      
      {isLoading ? (
        <div className="flex justify-center items-center h-32">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : reviews.length === 0 ? (
        <p className="text-gray-500">No reviews yet.</p>
      ) : (
        <div className="space-y-4">
          {reviews.map((review) => (
            <Card key={review.id} className="shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-center space-x-3 mb-2">
                  <User className="h-5 w-5 text-primary" />
                  <span className="font-semibold text-gray-800">{review.username || "Anonymous"}</span>
                  <span className="text-xs text-gray-500">
                    {formatDistanceToNow(review.timestamp, { addSuffix: true })}
                  </span>
                </div>
                <p className="text-gray-700 whitespace-pre-wrap">{review.message}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}