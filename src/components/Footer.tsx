import { Link } from "react-router-dom";
import { Github, Linkedin, Mail, Newspaper } from "lucide-react";

const Footer = () => {
  return (
    <footer className="border-t border-border/40 bg-background/50 backdrop-blur-sm mt-auto">
      <div className="container mx-auto px-4 py-12 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-2">
            <Link 
              to="/" 
              className="text-2xl font-display font-black tracking-tighter text-foreground mb-4 inline-block"
            >
              ELXN<span className="text-primary italic">.PLUS</span>
            </Link>
            <p className="text-muted-foreground text-sm max-w-xs leading-relaxed font-light">
              Just Elson Development Labs. <br />
              Building digital solutions worldwide. This vault serves as a central repository for my artifacts and shared media.
            </p>
            <div className="mt-6">
              <a 
                href="mailto:elsonmgaya25@gmail.com" 
                className="text-sm font-medium hover:text-primary transition-colors flex items-center gap-2 group"
              >
                <div className="p-2 rounded-none bg-primary/10 group-hover:bg-primary/20 transition-colors">
                  <Mail className="h-4 w-4 text-primary" />
                </div>
                elsonmgaya25@gmail.com
              </a>
            </div>
          </div>
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Vault Navigation</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li><Link to="/" className="text-muted-foreground hover:text-primary transition-colors">Digital Vault</Link></li>
              <li><Link to="/login" className="text-muted-foreground hover:text-primary transition-colors">Terminal Access</Link></li>
              <li><a href="https://github.com/justelson" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">Source Control</a></li>
            </ul>
          </div>
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground mb-6">Network Connect</h3>
            <ul className="space-y-3 text-sm font-medium">
              <li>
                <a href="https://github.com/justelson" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Github className="h-4 w-4" /> GitHub
                </a>
              </li>
              <li>
                <a href="https://www.linkedin.com/in/elson-erick-48335a36a/" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Linkedin className="h-4 w-4" /> LinkedIn
                </a>
              </li>
              <li>
                <a href="https://justelsoninsights.substack.com" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors flex items-center gap-2">
                  <Newspaper className="h-4 w-4" /> Newsletter
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-border/40 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-[10px] font-mono uppercase tracking-[0.1em] text-muted-foreground/60">
          <div className="flex items-center gap-4">
            <p>© {new Date().getFullYear()} JUST ELSON. ALL RIGHTS RESERVED.</p>
            <div className="w-1 h-1 rounded-full bg-white/20" />
            <p>SINCE 2025</p>
          </div>
          <div className="flex gap-6">
            <a href="#" className="hover:text-foreground transition-colors">DATA_PRIVACY</a>
            <a href="#" className="hover:text-foreground transition-colors">SYSTEM_PROTOCOLS</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
