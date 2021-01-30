import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import Chip from '@material-ui/core/Chip';
import Grid from '@material-ui/core/Grid';
import PropTypes from 'prop-types';
import React from 'react';
import Typography from '@material-ui/core/Typography';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  ticket: {
    margin: theme.spacing(0.2),
  },
}));

export default function WaitingList({ tickets }) {
  const classes = useStyles();

  return (
    <Grid className={classes.root} container spacing={1}>
      <Grid item xs={4} md={1}>
        <Typography
          variant="h5"
          color="secondary"
          gutterBottom
        >
          等待中：
        </Typography>
      </Grid>
      <Grid item xs={8} md={11}>
        {
          tickets.map((ticket) => (
            <Chip
              key={ticket.id}
              className={classes.ticket}
              clickable
              avatar={<Avatar>{ticket.id}</Avatar>}
              label={ticket.action.title}
              color="default"
              variant="outlined"
            />
          ))
        }
      </Grid>
    </Grid>
  );
}

WaitingList.propTypes = {
  tickets: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number.isRequired,
    action: PropTypes.shape({
      title: PropTypes.string.isRequired,
      workload: PropTypes.number.isRequired,
    }),
  })).isRequired,
};
