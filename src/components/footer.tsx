import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-background border-t py-12">
      <div className="container grid grid-cols-1 md:grid-cols-4 gap-8">
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <div className="relative h-16 w-16">
              <img 
                src="/lovable-uploads/02a4ca94-e61c-4f7c-9ef0-942b8abb8bb3.png" 
                alt="FormVerse Logo" 
                className="h-16 w-16"
              />
            </div>
            <span className="font-space-grotesk font-bold text-lg tracking-tight">
              <span className="text-white">FORM</span>
              <span className="bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">VERSE</span>
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            India's first launchpad for CAD creators. Turn your designs into capital.
          </p>
        </div>
        
        <div>
          <h5 className="font-medium mb-4">Platform</h5>
          <ul className="space-y-2">
            <li>
              <Link to="/discover" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Discover Models
              </Link>
            </li>
            <li>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Creator Dashboard
              </Link>
            </li>
            <li>
              <Link to="/upload" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Upload Model
              </Link>
            </li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium mb-4">Company</h5>
          <ul className="space-y-2">
            <li>
              <Link to="/#about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link to="/#pricing" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </a>
            </li>
          </ul>
        </div>
        
        <div>
          <h5 className="font-medium mb-4">Legal</h5>
          <ul className="space-y-2">
            <li>
              <Link to="/terms-of-service" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link to="/privacy-policy" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
            </li>
            <li>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                Licensing
              </a>
            </li>
          </ul>
        </div>
      </div>
      
      <div className="container mt-8 pt-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} <span className="font-space-grotesk bg-gradient-to-r from-purple-400 via-purple-500 to-purple-600 bg-clip-text text-transparent">FormVerse</span>. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">X</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">LinkedIn</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
              </svg>
            </a>
            <a href="#" className="text-muted-foreground hover:text-foreground">
              <span className="sr-only">Instagram</span>
              <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.067.06 1.407.06 4.123v.08c0 2.643-.012 2.987-.06 3.987-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.067.048-1.407.06-4.123.06h-.08c-2.643 0-2.987-.012-3.987-.06-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.047-1.024-.06-1.379-.06-3.808v-.63c0-2.43.013-2.784.06-3.808.049-1.064.218-1.791.465-2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 015.45 2.525c.636-.247 1.363-.416 2.427-.465C8.901 2.013 9.256 2 11.685 2h.63zm-.081 1.802h-.468c-2.456 0-2.784.011-3.807.058-.975.045-1.504.207-1.857.344-.467.182-.8.398-1.15.748-.35.35-.566.683-.748 1.15-.137.353-.3.882-.344 1.857-.047 1.023-.058 1.351-.058 4.041.058h.08c2.597 0 2.917-.01 3.96-.058.976-.045 1.505-.207 1.858-.344.466.182.8-.398 1.15-.748.353.137.882.3 1.857.344 1.054.048 1.37.058 4.041.058v.08c0 2.597-.01 2.917-.058 3.96-.045-.976-.207-1.505-.344-1.858a3.097 3.097 0 00-.748-1.15 3.098 3.098 0 00-1.15-.748c-.353-.137-.882-.3-1.857-.344-1.023-.047-1.351-.058-3.807-.058zM12 6.865a5.135 5.135 0 110 10.27 5.135 5.135 0 010-10.27zm0 1.802a3.333 3.333 0 100 6.666 3.333 3.333 0 000-6.666zm5.338-3.205a1.2 1.2 0 110 2.4 1.2 1.2 0 010-2.4z" clipRule="evenodd" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
