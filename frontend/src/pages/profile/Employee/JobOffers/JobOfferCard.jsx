import PropTypes from "prop-types";
import Button from "../../../../components/ui/Button/Button.jsx";
import RecentJobCard from "../Info/components/RecentJobCard.jsx";

export default function JobOfferCard({ offer, onAccept }) {
  return (
    <div className="rounded-xl border border-base-300 bg-base-100 shadow-sm overflow-hidden">
      <RecentJobCard
        job={offer}
        showAccepted={false}
        actionSlot={
          <div className="flex items-center gap-2">
            <Button
              label="Ver contrato"
              variant="primary"
              fullWidth={false}
              className="min-w-[120px]"
            />
            <Button
              label="Aceitar"
              variant="success"
              fullWidth={false}
              className="min-w-[120px]"
              onClick={() => onAccept(offer.requestId ?? offer.id)}
            />
          </div>
        }
      />
    </div>
  );
}

JobOfferCard.propTypes = {
  offer: PropTypes.object.isRequired,
  onAccept: PropTypes.func.isRequired,
};
