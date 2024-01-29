import React, { useState } from 'react';
import Text from '../Text';

interface ShowMoreProps {
  text: string;
  maxLength: number;
  displayName?: string;
  displayToggleText?: string;
}

export default function ShowMore({ text, maxLength, displayName, displayToggleText }: ShowMoreProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleText = () => {
    setIsExpanded(!isExpanded);
  };

  const displayText = isExpanded ? text : text.slice(0, maxLength);

  return (
    <div>
      <Text className={displayName}>{displayText}{!isExpanded && text.length > maxLength && '...'}</Text>

      {text.length > maxLength && (
        <Text  className={displayToggleText} onClick={toggleText}>
          {isExpanded ? 'Show Less' : 'Show More'}
        </Text>
      )}
    </div>
  );
};

