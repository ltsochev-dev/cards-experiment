import { Card, QuestionCard } from '@cards/types/default'
import { PlayerCards, QuestionCards } from '@cards/data'
import { Mutex } from 'async-mutex'

type BaseCollection<T extends Card> = Set<T>
type PlayerCardCollectionType = BaseCollection<Card>
type QuestionCardCollectionType = BaseCollection<QuestionCard>

class CardManager {
  private questionCards: QuestionCardCollectionType
  private usedQuestionCards: QuestionCardCollectionType
  private playerCards: PlayerCardCollectionType
  private usedPlayerCards: PlayerCardCollectionType
  private mutex: Mutex

  constructor() {
    this.questionCards = new Set(QuestionCards)
    this.playerCards = new Set(PlayerCards)
    this.usedQuestionCards = new Set()
    this.usedPlayerCards = new Set()
    this.mutex = new Mutex()
  }

  async drawCards<T extends Card>(
    count: number,
    list: BaseCollection<T>,
    usedList: BaseCollection<T>
  ): Promise<T[]> {
    const release = await this.mutex.acquire()

    try {
      if (count > list.size) {
        this.normalizeList(count - list.size, list, usedList)
      }

      const cards = this.drawRandomCards(count, list)

      cards.forEach(card => {
        list.delete(card)
        usedList.add(card)
      })

      return cards
    } finally {
      release()
    }
  }

  drawPlayerCards(num: number) {
    return this.drawCards(num, this.playerCards, this.usedPlayerCards)
  }

  drawQuestionCard() {
    return this.drawCards(1, this.questionCards, this.usedQuestionCards)
  }

  private normalizeList<T extends Card>(
    count: number,
    list: BaseCollection<T>,
    usedCards: BaseCollection<T>
  ) {
    const cards = this.drawRandomCards(count, usedCards)

    cards.forEach(card => {
      usedCards.delete(card)
      list.add(card)
    })

    return cards
  }

  private drawRandomCards<T extends Card>(
    count: number,
    list: BaseCollection<T>
  ) {
    const arr = Array.from(list)

    if (count > 1) {
      arr.sort(() => Math.random() - 0.5)
    }

    const cards: T[] = []

    for (let i = 0; i < count; i++) {
      const card = arr.splice(i, 1)[0]

      cards.push(card)
    }

    return cards
  }
}

const RoomCardDeck = new Map<string, CardManager>()

export default RoomCardDeck

export const createCardManager = () => new CardManager()
