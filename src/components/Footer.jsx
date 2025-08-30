import React from "react";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin, FaInstagram } from "react-icons/fa";

function Footer() {
  const socialLinks = [
    { icon: <FaGithub />, url: "https://github.com/arunmeenaa" },
    { icon: <FaLinkedin />, url: "https://www.linkedin.com/in/arunmeena0312" },
    { icon: <FaInstagram />, url: "https://www.instagram.com/arunmeenaa___?igsh=MXIycmxwbHU2ZnZuMw==" },
  ];

  return (
    <motion.footer
      className="bg-white/70 backdrop-blur-md py-6 text-center text-sm sm:text-base text-gray-700 border-t border-purple-300"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <p className="mb-3">
        © {new Date().getFullYear()}{" "}
        <span className="font-semibold text-purple-700">
          AI Caption Generator
        </span>
        . Built with 💜 using React & Tailwind.
      </p>

      {/* Social Icons */}
      <div className="flex justify-center gap-6 text-xl sm:text-2xl">
        {socialLinks.map((item, index) => (
          <motion.a
            key={index}
            href={item.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-600 hover:text-purple-700"
            whileHover={{ scale: 1.3, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            {item.icon}
          </motion.a>
        ))}
      </div>
    </motion.footer>
  );
}

export default Footer;
