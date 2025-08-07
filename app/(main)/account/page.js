"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const AccountDashboard = () => {
  const user = {
    name: "Ripon Kumar",
    email: "rk.ripon@gmail.com",
    username: "ripon123",
    isEducator: true,
    image: "",
    enrolledBooks: 3,
    enrolledSeries: 2,
    bio: "Teaching Science and Math for 5+ years...",
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* User Info */}
      <div className="flex items-center gap-4">
        <Avatar className="w-16 h-16">
          <AvatarImage src={user.image} />
          <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-xl font-semibold">{user.name}</h2>
          <p className="text-muted-foreground text-sm">{user.email}</p>
          <p className="text-sm">👤 Username: {user.username}</p>
          <p className="text-sm">
            🎓 Educator: {user.isEducator ? "✅ Yes" : "❌ No"}
          </p>
        </div>
      </div>

      {/* Enrollments */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">📚 Your Enrollments</h3>
        <p>Books: {user.enrolledBooks}</p>
        <p>Study Series: {user.enrolledSeries}</p>
        <div className="mt-2">
          <Button variant="outline" size="sm" asChild>
            <a href="/account/enrollments">View Enrollments</a>
          </Button>
        </div>
      </div>

      {/* Educator Info */}
      <div className="border rounded-lg p-4">
        <h3 className="font-semibold mb-2">🎓 Educator Info</h3>
        {user.isEducator ? (
          <>
            <p className="text-sm text-muted-foreground">{user.bio}</p>
            <div className="mt-2">
              <Button size="sm" asChild>
                <a href="/account/educator-profile">Edit Educator Profile</a>
              </Button>
            </div>
          </>
        ) : (
          <>
            <p className="text-sm text-muted-foreground">
              You are not an educator yet.
            </p>
            <div className="mt-2">
              <Button size="sm" asChild>
                <a href="/account/become-educator">Become an Educator</a>
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
export default AccountDashboard;
