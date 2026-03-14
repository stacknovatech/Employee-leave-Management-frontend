
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { UserPlus, Loader2, Mail, Lock, User, Building, KeyRound } from "lucide-react";

function RegisterPage() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
    department: "",
    managerId: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    if (!formData.name || !formData.email || !formData.password || !formData.department) {
      setErrorMessage("Please fill all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      setErrorMessage("Password must be at least 6 characters long.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    if (formData.role === "employee" && !formData.managerId) {
      setErrorMessage("Manager ID is required for employees.");
      return;
    }

    if (formData.role === "employee" && formData.managerId.length !== 24) {
      setErrorMessage("Manager ID must be exactly 24 characters. Please ask your manager for the correct ID.");
      return;
    }

    setIsLoading(true);
    try {
      const registeredUser = await register(formData);

      if (registeredUser.role === "manager") {
        navigate("/manager/dashboard", { replace: true });
      } else {
        navigate("/employee/dashboard", { replace: true });
      }
    } catch (err) {
      setErrorMessage(err.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="animate-fade-in border-[var(--border-main)]">
      <CardHeader className="text-center">
        <CardTitle className="text-xl">Create Account ✨</CardTitle>
        <CardDescription>
          Register to start managing your leaves
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleRegister} className="space-y-4">
          {errorMessage && (
            <div className="rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-3 text-sm text-red-400">
              {errorMessage}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="reg-name">Full Name</Label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <Input
                id="reg-name"
                placeholder="Enter your full name"
                value={formData.name}
                onChange={(e) => updateField("name", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-email">Email Address</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <Input
                id="reg-email"
                type="email"
                placeholder="Enter your email address"
                value={formData.email}
                onChange={(e) => updateField("email", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="reg-password">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <Input
                  id="reg-password"
                  type="password"
                  placeholder="Min 6 characters"
                  value={formData.password}
                  onChange={(e) => updateField("password", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="reg-confirm">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <Input
                  id="reg-confirm"
                  type="password"
                  placeholder="Re-enter password"
                  value={formData.confirmPassword}
                  onChange={(e) => updateField("confirmPassword", e.target.value)}
                  className="pl-10"
                  required
                />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-role">Role</Label>
            <Select
              id="reg-role"
              value={formData.role}
              onChange={(e) => updateField("role", e.target.value)}
            >
              <option value="employee">Employee</option>
              <option value="manager">Manager</option>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reg-department">Department</Label>
            <div className="relative">
              <Building className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
              <Input
                id="reg-department"
                placeholder="e.g. Engineering, HR, Marketing"
                value={formData.department}
                onChange={(e) => updateField("department", e.target.value)}
                className="pl-10"
                required
              />
            </div>
          </div>

          {/* Manager ID - sirf employees ke liye dikhega */}
          {formData.role === "employee" && (
            <div className="space-y-2 animate-fade-in">
              <Label htmlFor="reg-managerId">Manager ID</Label>
              <div className="relative">
                <KeyRound className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-secondary)]" />
                <Input
                  id="reg-managerId"
                  placeholder="e.g. 65f4a2b8c9e1d3a7b2c4e6f8"
                  value={formData.managerId}
                  onChange={(e) => updateField("managerId", e.target.value.trim())}
                  className="pl-10 font-mono text-xs"
                  maxLength={24}
                  required
                />
              </div>
              <p className="text-xs text-[var(--text-secondary)]">
                💡 Ask your manager for their unique 24-character ID. It looks like: <code className="text-brand-400 bg-[var(--bg-hover)] px-1 py-0.5 rounded">65f4a2b8c9e1d3...</code>
              </p>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            disabled={isLoading}
            className="w-full"
            id="register-submit-btn"
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating account...
              </>
            ) : (
              <>
                <UserPlus className="h-4 w-4" />
                Create Account
              </>
            )}
          </Button>
        </form>
      </CardContent>

      <CardFooter className="justify-center">
        <p className="text-sm text-[var(--text-secondary)]">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-brand-400 hover:text-brand-300 font-medium transition-colors"
          >
            Login here
          </Link>
        </p>
      </CardFooter>
    </Card>
  );
}

export default RegisterPage;
