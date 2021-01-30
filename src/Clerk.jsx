import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

function CircularProgressWithLabel({ value, label }) {
  return (
    <Box position="relative" display="inline-flex">
      <CircularProgress
        variant="determinate"
        value={value}
      />
      <Box
        top={0}
        left={0}
        bottom={0}
        right={0}
        position="absolute"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography
          variant="caption"
          component="div"
          color="textSecondary"
        >
          {label}
        </Typography>
      </Box>
    </Box>
  );
}

CircularProgressWithLabel.propTypes = {
  value: PropTypes.number.isRequired,
  label: PropTypes.string.isRequired,
};

export default function Clerk({
  employee,
  onDone,
  actionItem,
}) {
  const [served, setServed] = useState([]);
  const [progress, setProgress] = useState(0);

  // 跑 task 進度
  useEffect(() => {
    if (actionItem) {
      if (progress < actionItem.action.workload) {
        setTimeout(() => setProgress(progress + employee.speed), 120);
      }
    }
  }, [actionItem, progress, employee.speed]);

  // 回報已完成 tasks
  if (actionItem && progress >= actionItem.action.workload) {
    onDone();
    setServed([...served, actionItem.id]);
    setProgress(0);
  }

  let value;
  if (actionItem) {
    const { workload } = actionItem.action;
    value = Math.max(0, (progress * 100) / workload).toFixed(1);
  }

  return (
    <ListItem>
      <ListItemAvatar>
        <CircularProgressWithLabel
          value={value}
          label={employee.name}
        />
      </ListItemAvatar>
      <ListItemText
        primary={
          actionItem ? `處理 #${actionItem.id} - ${actionItem.action.title}` : '閒置中'
        }
        secondary={
          `已處理案件： ${served.join(', ')}`
        }
      />
    </ListItem>
  );
}

Clerk.propTypes = {
  employee: PropTypes.shape({
    name: PropTypes.string,
    speed: PropTypes.number,
  }).isRequired,
  onDone: PropTypes.func.isRequired,
  actionItem: PropTypes.shape({
    id: PropTypes.number.isRequired,
    action: PropTypes.shape({
      title: PropTypes.string.isRequired,
      workload: PropTypes.number.isRequired,
    }),
  }),
};

Clerk.defaultProps = {
  actionItem: null,
};
