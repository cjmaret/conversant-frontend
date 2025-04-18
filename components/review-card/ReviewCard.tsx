import React, { useState } from 'react';
import { TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import {
  CardContainer,
  HeaderArrowIcon,
  ErrorArrowIcon,
  CardHeader,
  CardContent,
  ErrorTextContainer,
  SnippetCard,
  OriginalText,
  CorrectedText,
  ErrorList,
  ErrorItem,
  ErrorHeader,
  ErrorText,
  BoldText,
  ItalicText,
  CardHeaderTextContainer,
  CardHeaderTextTitle,
  CardHeaderTextTime,
  ErrorHeaderText,
} from './styledReviewCard';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { extractTime } from '@/utils/functions/extractTime';
import { getConversationTitle } from '@/utils/functions/getConversationTitle';
import { LinearGradient } from 'expo-linear-gradient';
import { CorrectionDataType } from '@/types/types';

export default function ReviewCard({
  cardData,
}: {
  cardData: CorrectionDataType;
}) {
  const { createdAt, sentenceFeedback } = cardData;
  const [isCardExpanded, setIsCardExpanded] = useState(false);
  const [expandedErrors, setExpandedErrors] = useState<string[]>([]);

  const title = getConversationTitle(cardData.createdAt);

  const toggleCard = () => setIsCardExpanded((prev) => !prev);

  const toggleError = (errorId: string) => {
    setExpandedErrors((prevState) => {
      if (prevState.includes(errorId)) {
        return prevState.filter((id) => id !== errorId);
      } else {
        return [...prevState, errorId];
      }
    });
  };

  return (
    <CardContainer>
      <TouchableOpacity onPress={toggleCard}>
        <CardHeader>
          <HeaderArrowIcon>
            <MaterialCommunityIcons
              name={isCardExpanded ? 'chevron-up' : 'chevron-down'}
              size={20}
              color="white"
            />
          </HeaderArrowIcon>
          <CardHeaderTextContainer>
            <CardHeaderTextTitle>{title}</CardHeaderTextTitle>
            <CardHeaderTextTime>{extractTime(createdAt)}</CardHeaderTextTime>
          </CardHeaderTextContainer>
        </CardHeader>
      </TouchableOpacity>
      <View
        style={{
          maxHeight: isCardExpanded ? undefined : 150,
          overflow: 'hidden',
        }}>
        <CardContent>
          {sentenceFeedback.map((sentence) => (
            <SnippetCard key={sentence.id}>
              <OriginalText>
                <BoldText>You said:</BoldText> "{sentence.original}"
              </OriginalText>
              <CorrectedText>
                <BoldText>Corrected:</BoldText> "{sentence.corrected}"
              </CorrectedText>
              {sentence?.errors?.length > 0 && (
                <ErrorList>
                  {sentence.errors.map((error) => {
                    let errorIsExpanded = expandedErrors.includes(error.id);
                    return (
                      <ErrorItem key={error.id}>
                        <TouchableOpacity onPress={() => toggleError(error.id)}>
                          <View
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}>
                            <ErrorHeader>
                              <ErrorArrowIcon>
                                <MaterialCommunityIcons
                                  name={
                                    errorIsExpanded
                                      ? 'chevron-up'
                                      : 'chevron-down'
                                  }
                                  size={20}
                                  color="#b22222"
                                />
                              </ErrorArrowIcon>
                              <ErrorHeaderText>
                                <BoldText>Error snippet:</BoldText>{' '}
                                <ItalicText>"{error.error}"</ItalicText>
                              </ErrorHeaderText>
                            </ErrorHeader>
                          </View>
                        </TouchableOpacity>
                        {errorIsExpanded && (
                          <ErrorTextContainer>
                            <ErrorText>
                              <BoldText>Why?:</BoldText> {error.reason}
                            </ErrorText>
                            <ErrorText>
                              <BoldText>Suggestion:</BoldText>{' '}
                              {error.suggestion}
                            </ErrorText>
                            <ErrorText>
                              <BoldText>Improved Clause:</BoldText> "
                              {error.improvedClause}"
                            </ErrorText>
                          </ErrorTextContainer>
                        )}
                      </ErrorItem>
                    );
                  })}
                </ErrorList>
              )}
            </SnippetCard>
          ))}
        </CardContent>
      </View>
      {!isCardExpanded && (
        <TouchableWithoutFeedback onPress={() => setIsCardExpanded(true)}>
          <LinearGradient
            colors={[
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0)',
              'rgba(255, 255, 255, 0.9)',
            ]}
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              right: 0,
              height: '72%',
              borderRadius: 12,
            }}
          />
        </TouchableWithoutFeedback>
      )}
    </CardContainer>
  );
}
