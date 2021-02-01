import React, { useCallback, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Box from '@material-ui/core/Box';
import Checkbox from '@material-ui/core/Checkbox';
import CircularProgress from '@material-ui/core/CircularProgress';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction';
import ListItemText from '@material-ui/core/ListItemText';
import Typography from '@material-ui/core/Typography';

const size = 48;

function CircularProgressWithLabel({
  label,
  show,
  value,
}) {
  return (
    <Box position="relative" display="inline-flex" width={size} height={size}>
      {
        show && (
          <CircularProgress
            variant="determinate"
            value={value}
            size={size}
            color={value >= 100 ? 'primary' : 'secondary'}
          />
        )
      }
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
  label: PropTypes.string.isRequired,
  value: PropTypes.number.isRequired,
  show: PropTypes.bool.isRequired,
};

export default function Clerk({
  actionItem,
  active,
  employee,
  onDone,
  onToggle,
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

  const checkboxOnChange = useCallback(() => onToggle(!active), [active, onToggle]);

  let value;
  if (actionItem) {
    const { workload } = actionItem.action;
    value = Math.min(100, Math.max(0, (progress * 100) / workload));
  }

  return (
    <ListItem>
      <ListItemAvatar>
        <CircularProgressWithLabel
          label={employee.name}
          value={value}
          show={actionItem}
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
      <ListItemSecondaryAction>
        <Checkbox
          edge="end"
          onChange={checkboxOnChange}
          checked={active}
          disabled={actionItem}
        />
      </ListItemSecondaryAction>
    </ListItem>
  );
}

Clerk.propTypes = {
  active: PropTypes.bool.isRequired,
  employee: PropTypes.shape({
    name: PropTypes.string,
    speed: PropTypes.number,
  }).isRequired,
  onDone: PropTypes.func.isRequired,
  onToggle: PropTypes.func.isRequired,

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
