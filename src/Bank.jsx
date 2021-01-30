import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import CssBaseline from '@material-ui/core/CssBaseline';
import List from '@material-ui/core/List';

import Clerk from './Clerk';
import image from './bank.png';
import TicketMachine from './TicketMachine';
import WaitingList from './WaitingList';

const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    flexDirection: 'column',
    minHeight: '100vh',
    backgroundImage: `url("${image}")`,
    backgroundPosition: 'center top',
    backgroundSize: 'cover',
  },
  main: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(2),
  },
  footer: {
    padding: theme.spacing(3, 2),
    marginTop: 'auto',
  },
}));

/**
 * 分配待處理業務給空閑櫃檯的邏輯
 */
function dispatchTicketsToClerks(
  tickets,
  clerks,
  busyClerks = [],
) {
  if (!tickets.length || !clerks.length) {
    return [tickets, [...busyClerks, ...clerks]];
  }

  const [clerk, ...others] = clerks;
  if (clerk.active && !clerk.actionItem) {
    return dispatchTicketsToClerks(
      tickets.slice(1),
      others,
      [...busyClerks, { ...clerk, actionItem: tickets[0] }],
    );
  }

  return dispatchTicketsToClerks(
    tickets,
    others,
    [...busyClerks, clerk],
  );
}

export default function Bank({ employees, actions }) {
  const classes = useStyles();
  // 待處理任務
  const [tickets, setTickets] = useState([]);
  const [nextID, setNextID] = useState(1);
  // 所有櫃檯
  const [clerks, setClerks] = useState(employees.map((employee) => ({
    active: true,
    actionItem: null,
    employee,
  })));

  const handleActionDone = (i) => () => setClerks([
    ...clerks.slice(0, i),
    { ...clerks[i], actionItem: null },
    ...clerks.slice(i + 1),
  ]);

  const [remainTickets, nextClerks] = dispatchTicketsToClerks(
    tickets,
    clerks,
  );
  if (tickets.length !== remainTickets.length) {
    setTickets(remainTickets);
    setClerks(nextClerks);
  }

  const addTicket = useCallback((ticket) => {
    setTickets([...tickets, ticket]);
    setNextID(nextID + 1);
  }, [tickets, nextID]);

  return (
    <div className={classes.root}>
      <CssBaseline />
      <Container component="main" className={classes.main} maxWidth="sm">
        <List>
          {
            clerks.map(
              (clerk, index) => (
                <Clerk
                  key={clerk.employee.name}
                  actionItem={clerk.actionItem}
                  employee={clerk.employee}
                  onDone={handleActionDone(index)}
                />
              ),
            )
          }
        </List>
      </Container>
      <footer className={classes.footer}>
        <WaitingList tickets={tickets} />
        <TicketMachine
          actions={actions}
          onClick={addTicket}
          next={nextID}
          waitings={tickets.length}
        />
      </footer>
    </div>
  );
}

Bank.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.shape({
    title: PropTypes.string.isRequired,
    workload: PropTypes.number.isRequired,
  })).isRequired,
  employees: PropTypes.arrayOf(PropTypes.shape({
    name: PropTypes.string.isRequired,
    speed: PropTypes.number.isRequired,
  })).isRequired,
};
