import React, { useCallback, useMemo } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Fab from '@material-ui/core/Fab';
import PropTypes from 'prop-types';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1),
  },
  wrapper: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(3),
  },
}));

export default function TicketMachine({
  actions,
  waitings = 0,
  next = 1,
  onClick,
}) {
  const classes = useStyles();
  const action = useMemo(
    () => actions[(Math.floor(Math.random() * actions.length) + next) % actions.length],
    [actions, next],
  );
  const dispatcher = useCallback(() => onClick({ id: next, action }), [onClick, next, action]);
  return (
    <Fab
      className={classes.wrapper}
      onClick={dispatcher}
      color="primary"
      variant="extended"
    >
      <QueueOutlinedIcon className={classes.icon} />
      {`等待人數 ${waitings}，下一個號碼 ${next}`}
    </Fab>
  );
}

TicketMachine.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    workload: PropTypes.number.isRequired,
  })).isRequired,
  onClick: PropTypes.func.isRequired,
  next: PropTypes.number.isRequired,
  waitings: PropTypes.number.isRequired,
};
