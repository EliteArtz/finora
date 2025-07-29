import Button from '../Button/Button';
import React, { useState } from 'react';
import FontAwesomeIcon from '../FontAwesomeIcon/FontAwesomeIcon';
import AddExpenseModal from "../../modals/AddExpenseModal/AddExpenseModal";

const ExpenseButton = () => {
  const [ isModalVisible, setIsModalVisible ] = useState(false);

  const onPress = () => {
    setIsModalVisible(true);
  };

  return (<>
    <Button type="primary" padding="l" onPress={onPress}>
      <FontAwesomeIcon
        color="surface"
        size="l"
        icon="plus"
      />
    </Button>
    <AddExpenseModal isVisible={isModalVisible} setIsVisible={setIsModalVisible} />
  </>);
};

export default ExpenseButton;