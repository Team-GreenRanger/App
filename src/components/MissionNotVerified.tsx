import no_sign from "../assets/images/no-sign.svg";

interface MissionNotVerifiedProps {
  missionTitle?: string;
}

const MissionNotVerified = ({ missionTitle }: MissionNotVerifiedProps) => {
  return (
    <div className="flex flex-col items-center justify-center px-8">
      <div className="mb-8">
        <div className="text-8xl mb-4">
          <img src={no_sign} />
        </div>
      </div>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Verification failed
        </h1>
        
        {missionTitle && (
          <p className="text-lg font-medium text-gray-700 mb-4">{missionTitle}</p>
        )}
        
        <div className="space-y-2">
          <p className="text-gray-600 text-lg">
            Looks like the AI needs clearer proof.
            <br />
            Resubmit your mission!
          </p>
        </div>
      </div>
    </div>
  );
};

export default MissionNotVerified;
