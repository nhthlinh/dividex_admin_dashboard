import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { Lock } from "lucide-react";

export function AdminInviteAcceptPage() {
  const [params] = useSearchParams();
  const navigate = useNavigate();

  const token = params.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setError("");

    if (!password || !confirmPassword) {
      setError("Please fill in all fields");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      // TODO: call API
      // await authService.acceptAdminInvite({ token, password });

      console.log("Accept admin invite:", { token, password });

      // thành công → về login
      navigate("/login", { replace: true });
    } catch (e) {
      setError("Invalid or expired invitation link");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Card className="w-[420px]">
          <CardContent className="text-center text-slate-600">
            <CardHeader>
                Invitation link is invalid or expired.
            </CardHeader>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <Card className="w-[420px] shadow-lg">
        <CardHeader>
          <CardTitle className="text-center">
            Accept Admin Invitation
          </CardTitle>
          <p className="text-center text-sm text-slate-500">
            Set your password to activate admin account
          </p>
        </CardHeader>

        <CardContent className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm text-slate-600">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
              <Input
                type="password"
                className="pl-9"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-slate-600">
              Confirm Password
            </label>
            <Input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          {error && (
            <p className="text-sm text-red-600">{error}</p>
          )}

          <Button
            className="w-full bg-gradient-to-r from-rose-700 to-rose-600 text-white"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Activating..." : "Activate Admin Account"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
