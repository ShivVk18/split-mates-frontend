import { useEffect } from 'react';

const useSEO = ({ title, description }) => {
  useEffect(() => {
    if (title) {
      document.title = `${title} | SplitMates`;
    } else {
      document.title = "SplitMates - Split Group Expenses Without Awkwardness";
    }

    let metaDescription = document.querySelector('meta[name="description"]');
    if (!metaDescription) {
      metaDescription = document.createElement('meta');
      metaDescription.setAttribute('name', 'description');
      document.head.appendChild(metaDescription);
    }
    metaDescription.setAttribute('content', description || "SplitMates is the ultimate drama-free bill splitter app. Split group expenses, calculate optimal settlements using AI, and manage debts without awkwardness. No cap.");

    // OpenGraph og:title
    let ogTitle = document.querySelector('meta[property="og:title"]');
    if (!ogTitle) {
      ogTitle = document.createElement('meta');
      ogTitle.setAttribute('property', 'og:title');
      document.head.appendChild(ogTitle);
    }
    ogTitle.setAttribute('content', title ? `${title} | SplitMates` : "SplitMates - Split Group Expenses Without Awkwardness");

    // OpenGraph og:description
    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (!ogDesc) {
      ogDesc = document.createElement('meta');
      ogDesc.setAttribute('property', 'og:description');
      document.head.appendChild(ogDesc);
    }
    ogDesc.setAttribute('content', description || "SplitMates is the ultimate drama-free bill splitter app. Split group expenses, calculate optimal settlements using AI, and manage debts without awkwardness.");
  }, [title, description]);
};

export default useSEO;
