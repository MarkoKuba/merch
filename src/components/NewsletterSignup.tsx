import { useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { useState } from "react";
import { toast } from "sonner";
import { Mail } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const subscribe = useMutation(api.newsletter.subscribe);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await subscribe({ email });
      toast.success("Successfully subscribed to newsletter!");
      setEmail("");
    } catch (error: any) {
      if (error.message.includes("already subscribed")) {
        toast.error("This email is already subscribed");
      } else {
        toast.error("Failed to subscribe. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-gradient-to-r from-blue-600 to-green-600 rounded-lg p-8 text-white">
      <div className="max-w-2xl mx-auto text-center">
        <div className="flex justify-center mb-4">
          <Mail size={48} />
        </div>
        <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
        <p className="text-blue-100 mb-6">
          Subscribe to our newsletter and be the first to know about new arrivals, 
          exclusive offers, and special promotions.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email address"
            required
            className="flex-1 px-4 py-3 rounded-md text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white"
          />
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-white text-blue-600 px-6 py-3 rounded-md font-semibold hover:bg-gray-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? "Subscribing..." : "Subscribe"}
          </button>
        </form>
      </div>
    </div>
  );
}
