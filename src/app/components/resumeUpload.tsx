import React, { useState } from "react";
import Text from "./primitives/text";
import { FileUploader } from "react-drag-drop-files";
import Papa from "papaparse";
import axios from "axios";
import { ImSpinner2 } from "react-icons/im";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface ResumeUploadProps {
  file: File | null;
  setFile: React.Dispatch<React.SetStateAction<File | null>>;
}

interface CSVRow {
  Email: string;
  [key: string]: string;
}

const extractValidEmail = (input: string): string | null => {
  // Regular expression to match email addresses
  const emailRegex = /([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-z]{2,})/gi;
  const matches = input.match(emailRegex);
  console.log("Extracting email from:", input);
  console.log("Matches found:", matches);
  if (matches && matches.length > 0) {
    // Return the first matched email address
    const validEmail = matches[0].toLowerCase();
    console.log("Valid email extracted:", validEmail);
    return validEmail;
  }
  console.log("No valid email found");
  return null;
};

const ResumeUpload: React.FC<ResumeUploadProps> = ({ file, setFile }) => {
  const [error, setError] = useState<string | null>(null);
  const [csvData, setCsvData] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [createdBy, setCreatedBy] = useState<string>("");

  const handleChange = (file: File) => {
    console.log("File selected:", file.name);
    setFile(file);
    setError(null);
    parseCSV(file);
  };

  const parseCSV = (file: File) => {
    console.log("Starting CSV parsing...");
    Papa.parse<CSVRow>(file, {
      header: true,
      complete: (result) => {
        console.log("CSV parsing complete");
        console.log("Raw data:", result.data);
        console.log("Fields found:", result.meta.fields);

        const { data, meta } = result;

        const emailField = meta.fields?.find(
          (field) =>
            field.toLowerCase() === "email" || field.toLowerCase() === "emails"
        );

        if (!emailField) {
          console.error("No email field found in CSV");
          setError("CSV file must contain an 'Email' or 'email' column.");
          return;
        }

        console.log("Email field found:", emailField);

        const uniqueDomains = new Set<string>();
        const uniqueEmails = data
          .map((row) => {
            const emailValue = row[emailField];
            console.log("Processing row email:", emailValue);
            return emailValue ? extractValidEmail(emailValue) : null;
          })
          .filter((email): email is string => {
            if (email) {
              const domain = email.split("@")[1];
              console.log("Processing domain:", domain);
              if (domain && !uniqueDomains.has(domain)) {
                uniqueDomains.add(domain);
                console.log("New unique domain found:", domain);
                return true;
              }
              console.log("Domain already processed:", domain);
            }
            return false;
          });

        console.log("Unique domains found:", Array.from(uniqueDomains));
        console.log("Final unique emails:", uniqueEmails);
        setCsvData(uniqueEmails);
      },
      error: (error) => {
        console.error("CSV parsing error:", error);
        setError(`Error parsing CSV: ${error.message}`);
      },
    });
  };

  const handleSubmit = async () => {
    if (!file) {
      toast.error("Please upload a CSV file");
      return;
    }

    if (!createdBy.trim()) {
      toast.error("Please enter an email address");
      return;
    }

    if (csvData.length === 0) {
      toast.error("No valid email addresses found in the CSV file");
      return;
    }

    console.log("Submitting data:", csvData);

    const formattedData = {
      emails: csvData.map((email) => ({ email, createdBy })),
    };

    setIsLoading(true);
    try {
      const backendApi =
        process.env.NEXT_PUBLIC_BACKEND_URL ||
        "https://leads.proficientnowtech.com/api/nocodb/leads/apolloio/v2";

      console.log("Sending request to:", backendApi);

      const response = await axios.post(backendApi, formattedData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Response from server:", response.data);
      toast.success("Data submitted successfully!", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Error sending data to server:", error);
      setError("Failed to submit data. Please try again.");
      toast.error("Failed to submit data. Please try again.", {
        position: "top-right",
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const fileTypes = ["csv"];

  return (
    <div className="py-2 text-center flex flex-col items-center bg-dark-doccolor bg-gray-900 shadow-lg shadow-blue-500/10 h-screen w-full">
      <div className="rounded-md border-opacity-50 h-[min(50vh,50rem)] flex-col flex justify-center gap-4 w-[100%] items-center transition duration-300 ease-in-out transform">
        <Text className="font-medium text-[15px] text-gray-200">
          Drag and Drop the CSV here
        </Text>

        <div className="flex gap-6 items-center justify-center rounded-lg px-4 py-2 bg-gray-800 hover:bg-gray-700 transition duration-300 ease-in-out transform hover:scale-105 shadow-md shadow-blue-500/20">
          <FileUploader
            handleChange={handleChange}
            name="file"
            types={fileTypes}
            className="text-white"
          />
        </div>
        {error && <p className="text-red-500 mt-2 animate-pulse">{error}</p>}
      </div>
      <div className="flex flex-col w-full mt-6 items-center gap-4">
        <input
          type="text"
          value={createdBy}
          onChange={(e) => setCreatedBy(e.target.value)}
          placeholder="Email to send the position information to..."
          className="px-4 py-2 w-1/2 rounded-lg bg-gray-800 text-white border border-gray-700 focus:outline-none focus:border-blue-500 transition duration-300 ease-in-out transform hover:scale-105 shadow-md shadow-blue-500/20"
        />
        <button
          className="bg-blue-600 hover:bg-blue-500 text-white font-semibold py-2 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105 shadow-md shadow-blue-500/20"
          onClick={handleSubmit}
          disabled={
            !file || csvData.length === 0 || isLoading || !createdBy.trim()
          }
        >
          {isLoading ? (
            <div className="flex items-center gap-2">
              <ImSpinner2 className="animate-spin" />
              <span>Loading...</span>
            </div>
          ) : (
            "Submit"
          )}
        </button>
      </div>
      <ToastContainer />
    </div>
  );
};

export default ResumeUpload;
