import React, { useCallback, useMemo } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Badge from '@material-ui/core/Badge';
import Fab from '@material-ui/core/Fab';
import QueueOutlinedIcon from '@material-ui/icons/QueueOutlined';

const useStyles = makeStyles((theme) => ({
  icon: {
    marginRight: theme.spacing(1),
  },
  wrapper: {
    position: 'fixed',
    right: theme.spacing(2),
    bottom: theme.spacing(5),
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
      color="primary"
      onClick={dispatcher}
      variant="extended"
    >
      <Badge badgeContent={waitings} color="secondary">
        <QueueOutlinedIcon className={classes.icon} />
      </Badge>
      {`下一個號碼 ${next}`}
    </Fab>
  );
}

TicketMachine.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    workload: PropTypes.number.isRequired,
  })).isRequired,
  next: PropTypes.number.isRequired,
  onClick: PropTypes.func.isRequired,
  waitings: PropTypes.number.isRequired,
};
