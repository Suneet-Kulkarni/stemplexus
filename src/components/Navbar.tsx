
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Beaker, 
  BookOpen, 
  BrainCircuit, 
  LogOut,
  Menu, 
  X 
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

export const Navbar = ({ userLoggedIn = false }) => {
  const isMobile = useIsMobile();
  const [menuOpen, setMenuOpen] = React.useState(false);
  const { user, signOut } = useAuth();

  const toggleMenu = () => setMenuOpen(!menuOpen);
  
  const handleSignOut = async () => {
    await signOut();
  };
  
  // Get initials for avatar fallback
  const getInitials = () => {
    if (!user?.user_metadata?.full_name) return 'ST';
    
    const nameParts = user.user_metadata.full_name.split(' ');
    if (nameParts.length >= 2) {
      return `${nameParts[0][0]}${nameParts[1][0]}`.toUpperCase();
    }
    return nameParts[0].substring(0, 2).toUpperCase();
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="relative w-10 h-10 flex items-center justify-center rounded-full bg-primary text-primary-foreground">
            <BrainCircuit className="w-6 h-6" />
            <div className="absolute -top-1 -right-1 w-4 h-4 flex items-center justify-center rounded-full bg-stem-teal text-white text-xs font-bold">
              <Beaker className="w-3 h-3" />
            </div>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-stem-teal">
            STEMplexus
          </span>
        </Link>

        {isMobile ? (
          <Button variant="ghost" size="icon" onClick={toggleMenu}>
            {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        ) : (
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-4">
              <Link to="/subjects" className="text-foreground/80 hover:text-primary transition-colors">
                Subjects
              </Link>
              <Link to="/challenges" className="text-foreground/80 hover:text-primary transition-colors">
                Challenges
              </Link>
              <Link to="/community" className="text-foreground/80 hover:text-primary transition-colors">
                Community
              </Link>
              <Link to="/about" className="text-foreground/80 hover:text-primary transition-colors">
                About
              </Link>
            </div>
            
            {user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="outline" size="sm">Dashboard</Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Avatar className="cursor-pointer">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback className="bg-primary text-primary-foreground">{getInitials()}</AvatarFallback>
                    </Avatar>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>My Account</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link to="/profile" className="cursor-pointer w-full">Profile</Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link to="/settings" className="cursor-pointer w-full">Settings</Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleSignOut} className="text-destructive cursor-pointer">
                      <LogOut className="w-4 h-4 mr-2" />
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login">
                  <Button variant="outline" size="sm">Log in</Button>
                </Link>
                <Link to="/register">
                  <Button variant="default" size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Mobile menu */}
      <div className={cn(
        "fixed inset-0 z-40 flex flex-col bg-background pt-16 px-4 transition-transform duration-300 ease-in-out",
        menuOpen ? "translate-x-0" : "translate-x-full"
      )}>
        <div className="flex flex-col gap-4 py-6">
          <Link to="/subjects" className="text-lg py-2 border-b" onClick={toggleMenu}>
            Subjects
          </Link>
          <Link to="/challenges" className="text-lg py-2 border-b" onClick={toggleMenu}>
            Challenges
          </Link>
          <Link to="/community" className="text-lg py-2 border-b" onClick={toggleMenu}>
            Community
          </Link>
          <Link to="/about" className="text-lg py-2 border-b" onClick={toggleMenu}>
            About
          </Link>
        </div>
        
        {user ? (
          <div className="flex flex-col gap-4 mt-4">
            <Link to="/dashboard" onClick={toggleMenu}>
              <Button className="w-full">Dashboard</Button>
            </Link>
            <Link to="/profile" onClick={toggleMenu}>
              <Button variant="outline" className="w-full">Profile</Button>
            </Link>
            <Button 
              variant="destructive" 
              className="w-full mt-2"
              onClick={handleSignOut}
            >
              Log out
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4 mt-4">
            <Link to="/login" onClick={toggleMenu}>
              <Button variant="outline" className="w-full">Log in</Button>
            </Link>
            <Link to="/register" onClick={toggleMenu}>
              <Button variant="default" className="w-full">Get Started</Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
