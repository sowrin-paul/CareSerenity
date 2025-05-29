import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Snackbar from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';
import Button from '@mui/material/Button';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import HowToRegIcon from '@mui/icons-material/HowToReg';
import CancelIcon from '@mui/icons-material/Cancel';
import styles from '../css/Seminar_view.module.css';

const SeminarView = ({ userRole = 'user', accountId }) => {
  const apiUrl = import.meta.env.VITE_API_URL;
  const { seminar_id } = useParams();
  const navigate = useNavigate();

  const [seminar, setSeminar] = useState({});
  const [isRegistered, setIsRegistered] = useState(false);
  const [feedback, setFeedback] = useState({ positive: '', negative: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSeminar = async () => {
      setLoading(true);
      try {
        // Fetch seminar details
        const res = await fetch(`${apiUrl}/seminars/${seminar_id}/`);
        if (!res.ok) throw new Error('Failed to fetch seminar details');
        const data = await res.json();
        setSeminar(data);

        // Check registration status for user
        if (userRole === 'user' && accountId) {
          const regRes = await fetch(`${apiUrl}/seminars/${seminar_id}/is-registered/?acc_id=${accountId}`);
          if (regRes.ok) {
            const regData = await regRes.json();
            setIsRegistered(regData.registered);
          }
        }
      } catch (error) {
        setFeedback({ positive: '', negative: 'Failed to load seminar details.' });
      } finally {
        setLoading(false);
      }
    };

    fetchSeminar();
  }, [seminar_id, userRole, accountId, apiUrl]);

  const handleRegistration = async () => {
    try {
      const url = isRegistered
        ? `${apiUrl}/seminars/${seminar_id}/deregister/`
        : `${apiUrl}/seminars/${seminar_id}/register/`;
      const res = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ acc_id: accountId }),
      });
      if (!res.ok) throw new Error('Registration action failed');
      setIsRegistered(!isRegistered);
      setFeedback({
        positive: isRegistered ? 'Registration cancelled.' : 'Successfully registered!',
        negative: ''
      });
    } catch (error) {
      setFeedback({
        positive: '',
        negative: 'Registration action failed.'
      });
    }
  };

  const handleBack = () => {
    navigate('/user-seminar/');
  };

  if (loading) {
    return <div style={{ textAlign: 'center', marginTop: 40 }}>Loading...</div>;
  }

  return (
    <div className={styles.container}>
      <Snackbar
        open={!!feedback.positive}
        autoHideDuration={4000}
        onClose={() => setFeedback({ ...feedback, positive: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="success"
          onClose={() => setFeedback({ ...feedback, positive: '' })}
          sx={{ width: '100%' }}
        >
          {feedback.positive}
        </Alert>
      </Snackbar>
      <Snackbar
        open={!!feedback.negative}
        autoHideDuration={4000}
        onClose={() => setFeedback({ ...feedback, negative: '' })}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity="error"
          onClose={() => setFeedback({ ...feedback, negative: '' })}
          sx={{ width: '100%' }}
        >
          {feedback.negative}
        </Alert>
      </Snackbar>

      <div className={styles.accountInformationContainer}>
        <div className={styles.accountPicture}>
          <img src={'/assets/default_org.png'} alt="profile" />
        </div>
        <div className={styles.accountData}>
          <h1>{seminar.org_email}</h1>
        </div>
        <div className={styles.biography}>
          <h1>{seminar.title}</h1>
          <p>{seminar.subject}</p>
        </div>
      </div>

      <div className={styles.options}>
        <Button
          variant="outlined"
          color="primary"
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back
        </Button>
      </div>

      <div className={styles.card}>
        <div className={`${styles.positionRelative} ${styles.textWhite}`}>
          <div
            className={`${styles.cardImgOverlay} ${styles.three}`}
            style={{
              backgroundImage: `url(${seminar.banner ? apiUrl + '/media/' + seminar.banner : '/assets/default_banner.jpg'})`
            }}
          >
            <span className={`${styles.badge} ${styles.badgeLight} ${styles.textUppercase}`}>
              {seminar.seminar_date}
            </span>
          </div>
          <div className={styles.cardSmoothCaption}>
            <div className={`${styles.dFlex} ${styles.justifyContentBetween} ${styles.alignItemsCenter}`}>
              <div className={styles.mrAuto}>
                <h5 className={`${styles.cardTitle} ${styles.textWhite}`}>{seminar.title}</h5>
                <p>{seminar.subject}</p>
              </div>
            </div>
          </div>
        </div>
        <div className={styles.cardBody}>
          <p className={styles.guest}>Special Guest : {seminar.guest}</p>
          <p>{seminar.description}</p>
          <p className={styles.location}>
            {seminar.seminar_type === 'online'
              ? '[ Will be held Online ]'
              : `[ Location: ${seminar.location} ]`}
          </p>
          {userRole === 'user' && (
            <div style={{ display: 'flex', gap: '20px' }}>
              <Button
                variant={isRegistered ? "outlined" : "contained"}
                color={isRegistered ? "error" : "success"}
                startIcon={isRegistered ? <CancelIcon /> : <HowToRegIcon />}
                onClick={handleRegistration}
                id="button-30"
              >
                {isRegistered ? 'Cancel Registration' : 'Register'}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeminarView;