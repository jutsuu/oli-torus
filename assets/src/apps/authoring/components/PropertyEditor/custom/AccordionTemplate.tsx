import React from 'react';
import { Accordion } from 'react-bootstrap';
import ContextAwareToggle from '../../Accordion/ContextAwareToggle';
interface AccordionProps {
  key: string;
  title: string;
  properties: any;
}

const AccordionTemplate: React.FC<AccordionProps> = (props) => {
  return (
    <Accordion className="aa-properties-editor" defaultActiveKey="0">
      <div className="aa-panel-section-title-bar">
        <div className="d-flex align-items-center">
          <ContextAwareToggle eventKey="0" />
          <span className="title">{props.title}</span>
        </div>
      </div>
      <Accordion.Collapse eventKey="0">
        <div className="col-12">{props.properties.map((element: any) => element.content)}</div>
      </Accordion.Collapse>
    </Accordion>
  );
};

export default AccordionTemplate;
