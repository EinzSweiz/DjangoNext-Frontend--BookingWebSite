'use client'

import dynamic from "next/dynamic";

const MyPlace = dynamic(() => import("../components/MyPlace"), { ssr: false });

import { useState } from "react";
const AboutUs = () => {
  const [showMap, setShowMap] = useState(false)
     return (
      <section className="bg-white py-8 antialiased dark:bg-gray-900 md:py-16">
        <div className="mx-auto max-w-screen-xl px-4 2xl:px-0">
          <div className="mx-auto max-w-5xl">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white sm:text-2xl text-center">About Us</h2>
            <div className="my-8 xl:mb-16 xl:mt-12">
              <div className="flex justify-center">
                <img className="w-100 h-80 object-cover dark:hidden" src="/logo.png" alt="Image showcasing our platform" />
              </div>
              <div className="flex justify-center">
                <img className="hidden w-100 h-80 object-cover dark:block" src="logo.png" alt="Image showcasing our platform" />
              </div>
            </div>
            <div className="mx-auto max-w-2xl space-y-6">
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                At <span className="text-base font-semibold text-gray-900 dark:text-white">Diploma Genius</span>, we understand that creating a diploma project can be a challenging and time-consuming task. Our platform is designed to simplify the process by providing students with expert guidance, resources, and tools to craft their best diploma works.
              </p>
  
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Whether you're struggling with research, writing, or structuring your diploma, we offer comprehensive support that ensures your project stands out. Our team of professionals is committed to helping you at every stage of your academic journey.
              </p>
  
              <p className="text-base font-semibold text-gray-900 dark:text-white">Key Features and Benefits:</p>
              <ul className="list-outside list-disc space-y-4 pl-4 text-base font-normal text-gray-500 dark:text-gray-400">
                <li>
                  <span className="font-semibold text-gray-900 dark:text-white">Expert Guidance: </span>
                  We provide access to a network of professionals who guide you through the research, writing, and presentation stages of your diploma work.
                </li>
                <li>
                  <span className="font-semibold text-gray-900 dark:text-white">Customizable Templates: </span>
                  Choose from a wide selection of high-quality templates that fit the requirements of various academic fields.
                </li>
                <li>
                  <span className="font-semibold text-gray-900 dark:text-white">Timely Support: </span>
                  Get help whenever you need it. Our team ensures that your work is on track and completed within the deadlines.
                </li>
                <li>
                  <span className="font-semibold text-gray-900 dark:text-white">Plagiarism-Free Guarantee: </span>
                  We ensure that your diploma work is 100% original. All content is checked for plagiarism before submission.
                </li>
                <li>
                  <span className="font-semibold text-gray-900 dark:text-white">Comprehensive Resources: </span>
                  Access a library of academic resources, including research papers, guidelines, and writing tips.
                </li>
              </ul>
            </div>
            <div className="mx-auto mb-6 max-w-3xl space-y-6 md:mb-12">
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                Our platform ensures a user-friendly experience, offering intuitive navigation and easy access to tools that streamline the diploma creation process. With our step-by-step guides, you will feel confident about your work from start to finish.
              </p>
  
              <p className="text-base font-normal text-gray-500 dark:text-gray-400">
                By utilizing Diploma Genius, you can focus more on refining the content of your diploma and less on the technicalities, ensuring a higher-quality final submission.
              </p>
            </div>
            <div className="text-center">
            <a
              onClick={() => setShowMap(!showMap)}
              className="mb-2 mr-2 rounded-lg border border-gray-200 bg-white px-5 py-2.5 text-sm font-medium text-gray-900 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:outline-none focus:ring-4 focus:ring-gray-100 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700 cursor-pointer"
            >
              {showMap ? "Hide Map" : "See our Place"}
            </a>
            {showMap && (
            <div className="mt-8">
              <MyPlace height="400px" />
            </div>
            )}
            </div>
          </div>
        </div>
      </section>
    );
  };
  
  export default AboutUs;
  