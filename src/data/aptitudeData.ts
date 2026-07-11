export interface AptitudeQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number; // 0-indexed index of options
  explanation: string;
}

export const aptitudeTopics: Record<string, AptitudeQuestion[]> = {
  "Quantitative Aptitude": [
    {
      id: "qa-1",
      question: "A can do a piece of work in 12 days, and B can do it in 15 days. They work together for 5 days and then A leaves. How many days will B take to finish the remaining work?",
      options: ["3 days", "3.75 days", "4 days", "2.5 days"],
      correctAnswer: 1,
      explanation: "Total work is 60 units (LCM of 12 and 15). A's efficiency is 5 units/day, and B's is 4 units/day. In 5 days they complete (5+4)*5 = 45 units. Remaining work is 15 units. B takes 15 / 4 = 3.75 days to finish."
    },
    {
      id: "qa-2",
      question: "A train 240 m long passes a pole in 24 seconds. How long will it take to pass a platform 650 m long?",
      options: ["65 seconds", "89 seconds", "54 seconds", "74 seconds"],
      correctAnswer: 1,
      explanation: "Speed of the train = Length of train / Time to pass pole = 240 / 24 = 10 m/s. To pass a 650 m platform, total distance to cover is 240 + 650 = 890 m. Time = Distance / Speed = 890 / 10 = 89 seconds."
    },
    {
      id: "qa-3",
      question: "The average weight of 8 persons increases by 2.5 kg when a new person comes in place of one of them weighing 65 kg. What is the weight of the new person?",
      options: ["75 kg", "80 kg", "85 kg", "90 kg"],
      correctAnswer: 2,
      explanation: "Total increase in weight = 8 persons * 2.5 kg = 20 kg. Weight of the new person = Weight of the replaced person + Total increase = 65 kg + 20 kg = 85 kg."
    },
    {
      id: "qa-4",
      question: "By selling a bicycle for $2,850, a shopkeeper gains 14%. If the profit is reduced to 8%, then the selling price will be:",
      options: ["$2,600", "$2,700", "$2,800", "$3,000"],
      correctAnswer: 1,
      explanation: "Cost Price (CP) = Selling Price / (1 + Gain%) = 2850 / 1.14 = $2,500. New Selling Price at 8% profit = CP * 1.08 = 2500 * 1.08 = $2,700."
    },
    {
      id: "qa-5",
      question: "If 20% of A = 30% of B = 1/6 of C, then A : B : C is:",
      options: ["2:3:16", "3:2:12", "15:10:18", "10:15:18"],
      correctAnswer: 2,
      explanation: "0.2 A = 0.3 B = C / 6 => A/5 = 3B/10 = C/6. Multiply by 30 to clear fractions: 6A = 9B = 5C. Ratio A:B:C = 1/6 : 1/9 : 1/5. Multiplying by LCM (90) yields 15 : 10 : 18."
    },
    {
      id: "qa-6",
      question: "A sum of money at compound interest amounts to $672 in 2 years and to $714 in 3 years. The rate of interest per annum is:",
      options: ["5%", "6%", "6.25%", "6.5%"],
      correctAnswer: 2,
      explanation: "The difference $714 - $672 = $42 is the interest earned on $672 in 1 year. Rate = (Interest * 100) / (Principal * Time) = (42 * 100) / (672 * 1) = 6.25%."
    },
    {
      id: "qa-7",
      question: "Two numbers are in the ratio 3 : 5. If 9 is subtracted from each, the new numbers are in the ratio 12 : 23. The smaller number is:",
      options: ["27", "33", "49", "55"],
      correctAnswer: 1,
      explanation: "Let numbers be 3x and 5x. (3x - 9) / (5x - 9) = 12 / 23 => 23(3x - 9) = 12(5x - 9) => 69x - 207 = 60x - 108 => 9x = 99 => x = 11. The smaller number is 3x = 3 * 11 = 33."
    },
    {
      id: "qa-8",
      question: "A sum of $12,500 amounts to $15,500 in 4 years at simple interest. What is the rate of interest?",
      options: ["3%", "4%", "5%", "6%"],
      correctAnswer: 3,
      explanation: "Simple Interest (SI) = $15,500 - $12,500 = $3,000. SI = P * R * T / 100 => 3000 = 12500 * R * 4 / 100 => 3000 = 500 * R => R = 6%."
    },
    {
      id: "qa-9",
      question: "The population of a town was 160,000 three years ago. If it increased by 3%, 2.5%, and 5% respectively in the last three years, then the present population is:",
      options: ["177,000", "177,366", "179,150", "180,000"],
      correctAnswer: 1,
      explanation: "Present population = 160,000 * 1.03 * 1.025 * 1.05 = 164,800 * 1.025 * 1.05 = 168,920 * 1.05 = 177,366."
    },
    {
      id: "qa-10",
      question: "A dealer offers a discount of 10% on the marked price of an article and still makes a profit of 20%. If its marked price is $800, then its cost price is:",
      options: ["$500", "$550", "$600", "$650"],
      correctAnswer: 2,
      explanation: "Selling Price (SP) = 90% of Marked Price = 800 * 0.90 = $720. Cost Price (CP) at 20% profit = SP / 1.20 = 720 / 1.20 = $600."
    }
  ],
  "Logical Reasoning": [
    {
      id: "lr-1",
      question: "Look at this series: 2, 1, (1/2), (1/4), ... What number should come next?",
      options: ["(1/3)", "1/8", "2/8", "1/16"],
      correctAnswer: 1,
      explanation: "This is a geometric sequence where each number is divided by 2 to get the next term. (1/4) / 2 = 1/8."
    },
    {
      id: "lr-2",
      question: "Pointing to a photograph of a boy, Suresh said, 'He is the son of the only son of my mother.' How is Suresh related to that boy?",
      options: ["Brother", "Uncle", "Cousin", "Father"],
      correctAnswer: 3,
      explanation: "Suresh's mother's only son is Suresh himself. The boy is the son of that only son, so the boy is Suresh's son. Thus, Suresh is the Father."
    },
    {
      id: "lr-3",
      question: "If in a certain language, CHARCOAL is coded as 45162413 and MORAL is coded as 29613, how is ALLY coded in that language?",
      options: ["1337", "1339", "1332", "1334"],
      correctAnswer: 1,
      explanation: "From CHARCOAL and MORAL we get: A=1, L=3. ALLY begins with ALL which is 133. The only option starting with 133 and having a realistic letter assignment is 1339 (where Y=9)."
    },
    {
      id: "lr-4",
      question: "Statements: Some actors are singers. All singers are dancers. Conclusions: I. Some actors are dancers. II. No singer is an actor.",
      options: ["Only conclusion I follows", "Only conclusion II follows", "Either I or II follows", "Neither I nor II follows"],
      correctAnswer: 0,
      explanation: "Since some actors are singers and all singers are dancers, those actors who are singers are also dancers. Thus, conclusion I follows. Conclusion II is false because some singers can be actors."
    },
    {
      id: "lr-5",
      question: "If A x B means A is the father of B and A + B means A is the brother of B. Which of the following expressions means C is the son of M?",
      options: ["M - N + C", "M x C + N", "M + C x N", "C x M + N"],
      correctAnswer: 1,
      explanation: "In M x C + N, M is the father of C (M x C), and C is the brother of N (C + N). Therefore, C is male and a child of M, which means C is the son of M."
    },
    {
      id: "lr-6",
      question: "Find the odd one out from the given list of precious and base metals:",
      options: ["Gold", "Silver", "Platinum", "Iron"],
      correctAnswer: 3,
      explanation: "Gold, Silver, and Platinum are precious metals. Iron is a common base metal."
    },
    {
      id: "lr-7",
      question: "If South-East becomes North, North-East becomes West and so on. What will West become?",
      options: ["North-East", "North-West", "South-East", "South-West"],
      correctAnswer: 2,
      explanation: "The directions are rotated 135 degrees counter-clockwise. Rotating West (270 degrees) counter-clockwise by 135 degrees points to 135 degrees, which is South-East."
    },
    {
      id: "lr-8",
      question: "A is father of B and C. B is the son of A. But C is not the son of A. How is C related to A?",
      options: ["Daughter", "Son-in-law", "Brother", "Nephew"],
      correctAnswer: 0,
      explanation: "Since C is a child of A but C is not a son, C must be the daughter of A."
    },
    {
      id: "lr-9",
      question: "Arrange the words in a logical order: 1. Key, 2. Door, 3. Lock, 4. Room, 5. Switch-on",
      options: ["5, 1, 2, 4, 3", "4, 2, 1, 5, 3", "1, 3, 2, 4, 5", "1, 2, 3, 5, 4"],
      correctAnswer: 2,
      explanation: "The correct sequence is: Key (1) is used to open Lock (3) on the Door (2) to enter the Room (4) and then Switch-on (5) the lights."
    },
    {
      id: "lr-10",
      question: "If 'cook' is called 'butler', 'butler' is called 'manager', 'manager' is called 'teacher', 'teacher' is called 'clerk' and 'clerk' is called 'principal', who will teach in a class?",
      options: ["Manager", "Teacher", "Clerk", "Principal"],
      correctAnswer: 2,
      explanation: "A 'teacher' teaches in a class. According to the coding, 'teacher' is called 'clerk', so the 'clerk' will teach in the class."
    }
  ],
  "Probability": [
    {
      id: "pr-1",
      question: "A card is drawn from a well-shuffled pack of 52 cards. What is the probability of getting a queen of club or king of heart?",
      options: ["1/13", "2/13", "1/26", "1/52"],
      correctAnswer: 2,
      explanation: "There is 1 queen of clubs and 1 king of hearts in a standard deck. Total favorable cards = 2. Probability = 2 / 52 = 1 / 26."
    },
    {
      id: "pr-2",
      question: "Three unbiased coins are tossed. What is the probability of getting at least 2 heads?",
      options: ["1/4", "3/8", "1/2", "5/8"],
      correctAnswer: 2,
      explanation: "Total outcomes = 2^3 = 8. Favorable outcomes with at least 2 heads (HHH, HHT, HTH, THH) = 4. Probability = 4 / 8 = 1/2."
    },
    {
      id: "pr-3",
      question: "Two dice are thrown simultaneously. What is the probability of getting two numbers whose product is even?",
      options: ["1/2", "3/4", "3/8", "5/16"],
      correctAnswer: 1,
      explanation: "The product is odd only if both numbers are odd. P(both odd) = (3/6) * (3/6) = 1/4. Therefore, P(product is even) = 1 - 1/4 = 3/4."
    },
    {
      id: "pr-4",
      question: "A bag contains 6 black and 8 white balls. One ball is drawn at random. What is the probability that the ball drawn is white?",
      options: ["3/4", "4/7", "3/7", "1/14"],
      correctAnswer: 1,
      explanation: "Total balls = 6 + 8 = 14. White balls = 8. Probability = 8 / 14 = 4/7."
    },
    {
      id: "pr-5",
      question: "In a box, there are 8 red, 7 blue and 6 green balls. One ball is picked up randomly. What is the probability that it is neither red nor green?",
      options: ["1/3", "7/21", "1/2", "2/3"],
      correctAnswer: 0,
      explanation: "Neither red nor green means the ball is blue. There are 7 blue balls. Total balls = 8 + 7 + 6 = 21. Probability = 7 / 21 = 1/3."
    },
    {
      id: "pr-6",
      question: "What is the probability of getting a sum of 9 from two throws of a single die?",
      options: ["1/6", "1/8", "1/9", "1/12"],
      correctAnswer: 2,
      explanation: "Favorable pairs are (3,6), (4,5), (5,4), and (6,3). Total outcomes when throwing two dice is 36. Probability = 4 / 36 = 1/9."
    },
    {
      id: "pr-7",
      question: "In a lottery, there are 10 prizes and 25 blanks. A lottery is drawn at random. What is the probability of getting a prize?",
      options: ["2/7", "5/7", "1/5", "1/2"],
      correctAnswer: 0,
      explanation: "Total tickets = 10 + 25 = 35. Prizes = 10. Probability = 10 / 35 = 2/7."
    },
    {
      id: "pr-8",
      question: "A card is drawn from a pack of 52 cards. What is the probability of getting a spade or an ace?",
      options: ["4/13", "17/52", "1/4", "9/26"],
      correctAnswer: 0,
      explanation: "Favorable cards = 13 spades + 4 aces - 1 ace of spades (counted twice) = 16. Probability = 16 / 52 = 4/13."
    },
    {
      id: "pr-9",
      question: "A bag contains 2 red, 3 green and 2 blue balls. Two balls are drawn at random. What is the probability that none of the balls drawn is blue?",
      options: ["10/21", "11/21", "2/7", "5/7"],
      correctAnswer: 0,
      explanation: "Non-blue balls = 2 red + 3 green = 5. Ways to select 2 non-blue balls = 5C2 = 10. Total ways to select 2 balls = 7C2 = 21. Probability = 10 / 21."
    },
    {
      id: "pr-10",
      question: "An integer is chosen at random from the first 50 positive integers. What is the probability that the chosen integer is a prime number?",
      options: ["3/10", "1/5", "7/25", "4/15"],
      correctAnswer: 0,
      explanation: "There are 15 prime numbers between 1 and 50 (2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47). Probability = 15 / 50 = 3/10."
    }
  ],
  "Permutations & Combinations": [
    {
      id: "pc-1",
      question: "In how many different ways can the letters of the word 'LEAD' be arranged?",
      options: ["12", "24", "48", "6"],
      correctAnswer: 1,
      explanation: "The word LEAD has 4 distinct letters. Number of arrangements = 4! = 4 * 3 * 2 * 1 = 24."
    },
    {
      id: "pc-2",
      question: "In how many ways can a group of 5 men and 2 women be made out of a total of 7 men and 3 women?",
      options: ["63", "90", "126", "45"],
      correctAnswer: 0,
      explanation: "Ways to select 5 men from 7 = 7C5 = 21. Ways to select 2 women from 3 = 3C2 = 3. Total combinations = 21 * 3 = 63."
    },
    {
      id: "pc-3",
      question: "How many 3-digit numbers can be formed from the digits 2, 3, 5, 6, 7 and 9, which are divisible by 5 and none of the digits is repeated?",
      options: ["10", "15", "20", "30"],
      correctAnswer: 2,
      explanation: "To be divisible by 5, the last digit must be 5 (1 option). The hundreds and tens places can be filled by 5 remaining digits: 5 * 4 = 20 ways."
    },
    {
      id: "pc-4",
      question: "In how many ways can the letters of the word 'DIRECT' be arranged so that the vowels are always together?",
      options: ["120", "240", "720", "144"],
      correctAnswer: 1,
      explanation: "Vowels are I and E (2 letters, treated as 1 group). Consonants are D, R, C, T (4 letters). Total entities = 5. They can be arranged in 5! = 120 ways. Within the group, vowels can be arranged in 2! = 2 ways. Total = 120 * 2 = 240."
    },
    {
      id: "pc-5",
      question: "In how many different ways can the letters of the word 'DESIGN' be arranged so that the vowels are at the two ends?",
      options: ["48", "72", "36", "24"],
      correctAnswer: 0,
      explanation: "Vowels E and I must be at the two ends: 2 ways (E...I or I...E). The remaining 4 consonants can be arranged in the middle in 4! = 24 ways. Total = 2 * 24 = 48."
    },
    {
      id: "pc-6",
      question: "Out of 7 consonants and 4 vowels, how many words of 3 consonants and 2 vowels can be formed?",
      options: ["210", "25,200", "24,400", "21,300"],
      correctAnswer: 1,
      explanation: "Choose consonants: 7C3 = 35. Choose vowels: 4C2 = 6. Total selections = 35 * 6 = 210. Each 5-letter selection can be arranged in 5! = 120 ways. Total words = 210 * 120 = 25,200."
    },
    {
      id: "pc-7",
      question: "How many 4-letter words with or without meaning can be formed out of the letters of the word 'LOGARITHMS' if repetition of letters is not allowed?",
      options: ["5040", "4050", "2520", "2400"],
      correctAnswer: 0,
      explanation: "LOGARITHMS has 10 distinct letters. Choosing and arranging 4 letters = 10P4 = 10 * 9 * 8 * 7 = 5,040."
    },
    {
      id: "pc-8",
      question: "In a group of 6 girls and 4 boys, four children are to be selected. In how many different ways can they be selected such that at least one boy should be there?",
      options: ["150", "195", "209", "210"],
      correctAnswer: 1,
      explanation: "Total ways to select 4 out of 10 = 10C4 = 210. Ways with no boys (only girls) = 6C4 = 15. At least one boy = 210 - 15 = 195."
    },
    {
      id: "pc-9",
      question: "A box contains 2 white balls, 3 black balls, and 4 red balls. In how many ways can 3 balls be drawn from the box, if at least one black ball is to be included in the draw?",
      options: ["32", "48", "64", "96"],
      correctAnswer: 2,
      explanation: "Total balls = 9. Total ways to select 3 = 9C3 = 84. Ways to select 3 with no black balls (only red or white) = 6C3 = 20. At least one black ball = 84 - 20 = 64."
    },
    {
      id: "pc-10",
      question: "There are 15 points in a plane, out of which 6 are collinear. Find the number of straight lines that can be formed by joining these points.",
      options: ["90", "91", "105", "120"],
      correctAnswer: 1,
      explanation: "Lines from 15 points = 15C2 = 105. Subtract collinear overlaps: 6C2 = 15. Add 1 back because collinear points form exactly one straight line: 105 - 15 + 1 = 91."
    }
  ]
};
