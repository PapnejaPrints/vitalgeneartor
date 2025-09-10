import { MadeWithDyad } from "@/components/made-with-dyad";
import VitalDataGenerator from "@/components/VitalDataGenerator"; // Import the new component

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <h1 className="text-4xl font-bold mb-8 text-gray-800 dark:text-gray-100">
        Vital Data Generator
      </h1>
      <VitalDataGenerator /> {/* Render the new component */}
      <MadeWithDyad />
    </div>
  );
};

export default Index;