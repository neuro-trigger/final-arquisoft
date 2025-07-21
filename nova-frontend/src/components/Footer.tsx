import Image from "next/image";
import Link from "next/link";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 hidden md:block">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <Image src="/NOVAw.png" alt="Nova" width={100} height={100} />
            </div>
            <p className="text-gray-400">
              La forma más simple de administrar tu dinero y hacer
              transferencias seguras.
            </p>
          </div>

          {/* <div>
            <h3 className="font-bold text-lg mb-4">Company</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white">
                  About Us
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white">
                  Help Center
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-gray-400 hover:text-white"
                >
                  Contact Us
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-gray-400 hover:text-white"
                >
                  Security
                </Link>
              </li>
              <li>
                <Link href="/status" className="text-gray-400 hover:text-white">
                  Status
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Legal</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white">
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-400 hover:text-white"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/licenses"
                  className="text-gray-400 hover:text-white"
                >
                  Licenses
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="text-gray-400 hover:text-white"
                >
                  Cookie Policy
                </Link>
              </li>
            </ul>
          </div> */}
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 mb-4 md:mb-0">
            © {new Date().getFullYear()} Nova. All rights reserved.
          </p>
          <div className="flex space-x-4">
            {/* <Link href="#" className="text-gray-400 hover:text-white text-xl">
              <FaFacebook />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-xl">
              <FaTwitter />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-xl">
              <FaInstagram />
            </Link>
            <Link href="#" className="text-gray-400 hover:text-white text-xl">
              <FaLinkedin />
            </Link> */}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
