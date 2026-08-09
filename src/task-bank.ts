export type Level = "A1" | "A2" | "B1" | "B2" | "C1";

export type GrammarTask = {
  id: string;
  level: Level;
  topic: string;
  prompt: string;
  options: string[];
  answer: string;
  explanation: string;
};

const tasks: GrammarTask[] = [];
let sequence = 0;

function add(level: Level, topic: string, prompt: string, options: string[], answer: string, explanation: string) {
  tasks.push({ id: `${level}-${topic.replace(/\W+/g, "-").toLowerCase()}-${++sequence}`, level, topic, prompt, options, answer, explanation });
}

const presentSimple = [
  ["I usually ___ fantasy books before bed.", "read", "read", "reads"], ["Do you ___ basketball after school?", "play", "play", "plays"], ["We ___ English on Tuesdays.", "study", "study", "studies"],
  ["My friends ___ a film every Friday.", "watch", "watch", "watches"], ["My brother ___ to the swimming pool by bus.", "go", "goes", "go"], ["Mia ___ science at our school.", "teach", "teaches", "teach"],
  ["My dad ___ dinner on Sundays.", "cook", "cooks", "cook"], ["Anna often ___ to school with her friend.", "walk", "walks", "walk"], ["Leo ___ two younger sisters.", "have", "has", "have"], ["The library ___ at nine every morning.", "open", "opens", "open"],
] as const;
presentSimple.forEach(([prompt, verb, correct, wrong]) => add("A1", "Present Simple", prompt, [correct, wrong, `${verb}ing`, `is ${verb}`], correct, `Use the Present Simple form “${correct}” for a routine, fact or regular action.`));

const continuous = [
  ["Please be quiet. I ___ a book.", "am reading", "is reading"], ["Can you hear me? ___ you ___?", "are listening", "is listening"], ["We ___ for a test now.", "are studying", "study"],
  ["Look! The children ___ in the park.", "are running", "is running"], ["My sister ___ dinner now.", "is cooking", "are cooking"], ["Alex ___ on the sofa.", "is sleeping", "sleeps"],
  ["The boys ___ football at the moment.", "are playing", "is playing"], ["Leo ___ an email now.", "is writing", "writes"], ["The students ___ in the classroom.", "are talking", "talk"], ["Take an umbrella. It ___ now.", "is raining", "are raining"],
] as const;
continuous.forEach(([prompt, correct, wrong]) => add("A1", "Present Continuous", prompt, [correct, wrong, correct.replace("ing", "ed"), correct.replace(/^(am|is|are)/, "was")], correct, `Use am/is/are + verb-ing for an action happening now or around now.`));

const pastVerbs = [
  ["go", "went", "Yesterday, Tom ___ to the cinema."], ["see", "saw", "We ___ a good film last night."], ["take", "took", "Mia ___ a photo of her dog."], ["come", "came", "They ___ home late."], ["write", "wrote", "Leo ___ a message yesterday."],
  ["make", "made", "Mum ___ a cake for us."], ["find", "found", "We ___ the keys under the chair."], ["buy", "bought", "She ___ a new jacket last week."], ["eat", "ate", "They ___ lunch at noon."], ["leave", "left", "The train ___ at six."],
  ["give", "gave", "Our teacher ___ us new books."], ["speak", "spoke", "I ___ to Anna yesterday."], ["run", "ran", "Ben ___ to the bus stop."], ["swim", "swam", "We ___ in the lake."], ["drink", "drank", "The children ___ all the juice."],
  ["sing", "sang", "The students ___ a funny song."], ["begin", "began", "The lesson ___ at nine o’clock."], ["break", "broke", "The ball ___ the window."], ["bring", "brought", "Ava ___ her school bag."], ["build", "built", "They ___ a tree house last summer."],
  ["choose", "chose", "We ___ the blue T-shirt."], ["drive", "drove", "Leo ___ his dad’s car."], ["feel", "felt", "I ___ nervous before the test."], ["get", "got", "The team ___ an email from the teacher."], ["know", "knew", "She ___ the correct answer."],
  ["meet", "met", "We ___ our new neighbour yesterday."], ["send", "sent", "Dad ___ me a photo."], ["think", "thought", "They ___ the shop was closed."], ["wear", "wore", "Mia ___ her red jacket."], ["say", "said", "The teacher ___ the answer was correct."],
] as const;
pastVerbs.forEach(([base, past, sentence]) => {
  add("A1", "Past Simple", sentence, [past, base, `${base}ed`, `has ${past}`], past, `“${past}” is the Past Simple form of “${base}”.`);
  add("A1", "Irregular Verbs", `Choose the past form of “${base}”.`, [past, base, `${base}ed`, `${past}ed`], past, `The irregular form is “${past}”.`);
});

[
  ["I can see ___ moon.", "the", "a", "an"], ["She has ___ orange bag.", "an", "a", "the"], ["He is ___ engineer.", "an", "a", "the"],
  ["We found ___ new café.", "a", "an", "the"], ["___ Sun is a star.", "The", "A", "An"], ["May I have ___ apple?", "an", "a", "the"],
  ["This is ___ best cake here.", "the", "a", "an"], ["Leo wants to be ___ doctor.", "a", "an", "the"], ["There is ___ egg in the box.", "an", "a", "the"], ["Open ___ door, please.", "the", "a", "an"],
].forEach(([prompt, answer, ...rest]) => add("A1", "Articles", prompt, [answer, ...rest, "—"], answer, `“${answer}” is the correct article in this sentence.`));

[
  ["The cat is ___ the table.", "under", "at", "between"], ["The poster is ___ the wall.", "on", "in", "at"], ["We meet ___ six o’clock.", "at", "on", "in"],
  ["My birthday is ___ May.", "in", "on", "at"], ["The mission starts ___ Monday.", "on", "in", "at"], ["The robot is ___ the two boxes.", "between", "behind", "on"],
  ["The keys are ___ my bag.", "in", "at", "on"], ["The bus stop is ___ the school.", "near", "under", "in"], ["Wait ___ the door.", "at", "on", "between"], ["The cat is ___ the curtain.", "behind", "at", "on"],
].forEach(([prompt, answer, ...rest]) => add("A1", "Prepositions", prompt, [answer, ...rest, "from"], answer, `The preposition “${answer}” completes this phrase.`));

addRows("A2", "Comparatives", [
  ["A cheetah is ___ than a horse.", "faster", "fast", "the fastest", "more faster"], ["Which is ___ object in the night sky?", "the brightest", "brighter", "bright", "most bright"],
  ["Canada is ___ than Germany.", "larger", "large", "the largest", "more large"], ["This backpack is ___ one in the shop.", "the smallest", "smaller", "small", "most small"],
  ["The second exercise was ___ than the first.", "easier", "easy", "the easiest", "more easier"], ["This café makes ___ hot chocolate in town.", "the best", "better", "good", "the goodest"],
  ["Today’s weather is ___ than yesterday’s.", "worse", "bad", "the worst", "more bad"], ["Our new school is ___ from home than the old one.", "farther", "far", "the farthest", "more far"],
  ["The book was ___ than the film.", "more interesting", "interesting", "the most interesting", "interestinger"], ["Mountaineering is one of ___ sports.", "the most dangerous", "more dangerous", "dangerous", "the dangeroust"],
], "Choose the comparative or superlative form that fits the context.");

const perfect = [
  ["I ___ my homework, so I can play now.", "have finished", "has finished"], ["You ___ Berlin three times.", "have visited", "visited"], ["We ___ a lovely café near our school.", "have found", "has found"], ["They ___ that film already.", "have seen", "saw"], ["Mia ___ four emails today.", "has written", "have written"],
  ["My aunt ___ across the Atlantic many times.", "has flown", "have flew"], ["Dad ___ the broken lamp.", "has repaired", "repaired"], ["Leo ___ hundreds of wildlife photos.", "has taken", "has took"], ["The class ___ every task on the list.", "has completed", "have complete"], ["She ___ a famous writer before.", "has never met", "never met"],
] as const;
perfect.forEach(([prompt, correct, wrong]) => add("A2", "Present Perfect", prompt, [correct, wrong, correct.replace("has", "is").replace("have", "are"), correct.replace(/^(has|have)/, "had")], correct, `Use have/has + past participle for a past action connected to now.`));

pastVerbs.forEach(([base, past, sentence]) => add("A2", "Irregular Verbs", sentence, [past, base, `${base}ed`, `have ${past}`], past, `A finished past action takes Past Simple: “${past}”.`));

[
  ["You ___ wear a seat belt in a car.", "must", "might", "could"], ["___ I use your phone?", "May", "Must", "Should"], ["We ___ finish today; tomorrow is fine.", "don’t have to", "mustn’t", "can’t"],
  ["You ___ touch that wire. It is dangerous.", "mustn’t", "don’t have to", "might"], ["It is cloudy. It ___ rain later.", "might", "must", "can’t"], ["You look tired. You ___ rest.", "should", "mustn’t", "can"],
  ["When she was six, she ___ read.", "could", "can", "must"], ["The lights are on. They ___ be at home.", "must", "might not", "can’t"], ["This ___ be Tom’s coat; it is too small.", "can’t", "must", "should"], ["We ___ leave now if we want.", "can", "have to", "mustn’t"],
].forEach(([prompt, answer, ...rest]) => add("A2", "Modal Verbs", prompt, [answer, ...rest, "will"], answer, `“${answer}” expresses the meaning needed here.`));

const future = [
  ["Look at those clouds! It ___ rain.", "is going to", "will", "is"], ["I think people ___ live on Mars one day.", "will", "are going to", "are"], ["We ___ the captain at 6 p.m.; it is arranged.", "are meeting", "will meet", "meet"],
  ["The train ___ at 08:20 according to the timetable.", "leaves", "is going to leave", "will leave"], ["I promise I ___ help you.", "will", "am going to", "am helping"], ["They have bought some paint. They ___ paint the kitchen.", "are going to", "will", "paint"],
  ["Maybe she ___ join us later.", "will", "is going to", "is"], ["Watch out! You ___ drop it!", "are going to", "will", "drop"], ["This time tomorrow, we ___ to Rome.", "will be flying", "fly", "are going to fly"], ["By Friday, we ___ the project.", "will have completed", "will complete", "complete"],
].forEach(([prompt, answer, ...rest], i) => add(i < 8 ? "A2" : "B2", "Future Forms", prompt, [answer, ...rest, "would"], answer, `The time and context require “${answer}”.`));

const firstConditional = [
  ["If you press this button, the screen ___ .", "will start", "starts", "would start"], ["If we leave the house now, we ___ before lunch.", "will arrive", "arrive", "would arrive"],
  ["If she studies regularly, she ___ the exam.", "will pass", "passed", "would pass"], ["If they don’t hurry, they ___ the last train.", "will miss", "missed", "would miss"], ["If it rains this afternoon, we ___ at the museum longer.", "will stay", "stayed", "would stay"],
] as const;
firstConditional.forEach(([prompt, answer, ...rest]) => add("B1", "Conditionals", prompt, [answer, ...rest, "have"], answer, `First conditional: if + Present Simple, will + base verb.`));

const secondConditional = [
  ["If I were you, I ___ the blue jacket.", "would choose", "will choose", "chose"], ["If we had longer holidays, we ___ around Japan.", "could travel", "can travel", "travelled"],
  ["If she knew the answer, she ___ us.", "would tell", "will tell", "told"], ["What ___ you do if you found a wallet in the street?", "would", "will", "did"], ["If our teacher were here, the problem ___ easier.", "would be", "will be", "was"],
] as const;
secondConditional.forEach(([prompt, answer, ...rest]) => add("B1", "Conditionals", prompt, [answer, ...rest, "has"], answer, `Second conditional describes an unreal or hypothetical present situation.`));

const passive = [
  ["The engine ___ every week.", "is checked", "checks", "is checking"], ["The message ___ yesterday.", "was decoded", "decoded", "is decoded"], ["The modules ___ by robots.", "are repaired", "repair", "are repairing"],
  ["A new station ___ next year.", "will be built", "will build", "is building"], ["The crystals ___ in 2085.", "were discovered", "discovered", "have discover"], ["The work ___ already.", "has been completed", "has completed", "was complete"],
  ["The results ___ tomorrow.", "will be announced", "will announce", "are announcing"], ["English ___ in many countries.", "is spoken", "speaks", "is speaking"], ["The ship ___ at the moment.", "is being repaired", "is repaired", "repairs"], ["The device must ___ carefully.", "be handled", "handle", "be handling"],
] as const;
passive.forEach(([prompt, answer, ...rest], i) => add(i < 7 ? "B1" : "B2", "Passive Voice", prompt, [answer, ...rest, "has been"], answer, `Passive voice uses the correct form of be + past participle.`));

const reported = [
  ["“I am tired,” she said. She said that she ___ tired.", "was", "is", "has been"], ["“We will return,” they said. They said they ___ return.", "would", "will", "can"],
  ["“I saw the light,” Leo said. Leo said he ___ the light.", "had seen", "saw", "has seen"], ["“Do you know the code?” She asked if I ___ the code.", "knew", "know", "had know"], ["“Don’t touch it,” he said. He told me ___ it.", "not to touch", "don’t touch", "not touching"],
  ["“Where are you going?” She asked where I ___ .", "was going", "am going", "went"], ["“I can help,” Mia said. Mia said she ___ help.", "could", "can", "would"], ["“Open the door,” he said. He told us ___ the door.", "to open", "open", "opening"], ["“I have finished,” she said. She said she ___ .", "had finished", "has finished", "finished"], ["“Why did it stop?” He asked why it ___ .", "had stopped", "stopped", "has stopped"],
] as const;
reported.forEach(([prompt, answer, ...rest], i) => add(i < 7 ? "B1" : "B2", "Reported Speech", prompt, [answer, ...rest, "would have"], answer, `Reported speech requires the appropriate backshift and sentence order.`));

[
  ["If they ___ earlier, they would have caught the shuttle.", "had left", "left", "would leave"], ["If I had known, I ___ you.", "would have told", "would tell", "had told"],
  ["If the system hadn’t failed, we ___ now.", "would be flying", "will fly", "had flown"], ["If she were more careful, she ___ the device yesterday.", "wouldn’t have broken", "didn’t break", "wouldn’t break"], ["Had we seen the warning, we ___ course.", "would have changed", "changed", "will change"],
  ["Were I the captain, I ___ the mission.", "would postpone", "will postpone", "postponed"], ["But for your help, we ___ .", "would have failed", "will fail", "had failed"], ["If only I ___ the answer now.", "knew", "had known", "would know"], ["I wish we ___ more time yesterday.", "had had", "have", "would have"], ["Suppose the signal ___ genuine—what would you do?", "were", "is", "has been"],
].forEach(([prompt, answer, ...rest], i) => add(i < 5 ? "B2" : "C1", "Conditionals", prompt, [answer, ...rest, "will have"], answer, `This sentence uses an advanced hypothetical conditional structure.`));

[
  ["Rarely ___ such a clear signal.", "have we received", "we have received", "did we received"], ["Not only ___ the code, but she also repaired the device.", "did she decode", "she decoded", "has she decode"],
  ["No sooner ___ than the alarm sounded.", "had we arrived", "we arrived", "did we arrive"], ["Only after the test ___ the fault.", "did they discover", "they discovered", "had they discover"], ["Under no circumstances ___ this hatch.", "should you open", "you should open", "you open"],
  ["So intense ___ that the sensors failed.", "was the light", "the light was", "did the light"], ["Little ___ that the signal was a trap.", "did we know", "we knew", "had we known"], ["Hardly ___ when the engines stopped.", "had we taken off", "we took off", "did we take off"], ["Were the plan ___, we would begin tomorrow.", "to be approved", "approved", "approving"], ["It is essential that every pilot ___ the protocol.", "follow", "follows", "will follow"],
].forEach(([prompt, answer, ...rest]) => add("C1", "Advanced Structures", prompt, [answer, ...rest, "has"], answer, `This is a formal advanced structure with inversion or the subjunctive.`));

[
  ["You ___ have warned us; we already knew.", "needn’t", "mustn’t", "couldn’t"], ["She ___ have missed the message; she was online.", "can’t", "must", "should"], ["They ___ have taken the wrong route; I’m not certain.", "might", "must", "can’t"],
  ["He ___ have checked the engine before launch.", "should", "would", "can"], ["The lights are off; they ___ have left.", "must", "can’t", "needn’t"], ["You ___ have bought fuel; the tank was full.", "needn’t", "should", "must"],
  ["She ___ well be the best candidate.", "may", "must", "should"], ["I would rather you ___ tomorrow.", "came", "come", "will come"], ["You had better ___ the captain now.", "tell", "to tell", "telling"], ["He ___ to have completed the repair by now.", "ought", "should", "must"],
].forEach(([prompt, answer, ...rest], i) => add(i < 6 ? "B2" : "C1", "Modal Verbs", prompt, [answer, ...rest, "will"], answer, `The modal form “${answer}” expresses the required degree of certainty, regret or advice.`));

function addRows(level: Level, topic: string, rows: readonly (readonly string[])[], explanation: string) {
  rows.forEach(([prompt, answer, ...distractors]) => add(level, topic, prompt, [answer, ...distractors], answer, explanation.replace("{answer}", answer)));
}

addRows("A1", "There is / There are", [
  ["___ a helmet on the chair.", "There is", "There are", "It is", "They are"],
  ["___ three windows in the room.", "There are", "There is", "They have", "It has"],
  ["___ any water in the bottle?", "Is there", "Are there", "There is", "Does there"],
  ["___ any stars tonight?", "Are there", "Is there", "There are", "Do there"],
  ["There ___ a message for you.", "is", "are", "be", "have"],
  ["There ___ two computers in the classroom.", "are", "is", "has", "be"],
  ["There isn’t ___ milk left.", "any", "some", "many", "a"],
  ["There are ___ new students today.", "some", "any", "a", "much"],
  ["How many chairs ___?", "are there", "is there", "there are", "do there"],
  ["There ___ not a problem now.", "is", "are", "have", "does"],
], "Use the singular or plural form of there is / there are: “{answer}”.");

addRows("A1", "Questions", [
  ["___ you like funny stories?", "Do", "Does", "Are", "Is"],
  ["___ Mia play chess?", "Does", "Do", "Is", "Has"],
  ["Where ___ they live?", "do", "does", "are", "is"],
  ["What time ___ the lesson start?", "does", "do", "is", "has"],
  ["___ you watching TV now?", "Are", "Do", "Does", "Is"],
  ["Why ___ he laughing?", "is", "does", "do", "are"],
  ["___ she visit the museum yesterday?", "Did", "Does", "Was", "Has"],
  ["Where ___ you go last weekend?", "did", "do", "were", "have"],
  ["Who ___ your English teacher?", "is", "does", "do", "are"],
  ["How old ___ your brother?", "is", "does", "has", "are"],
], "English questions require the correct auxiliary or form of be: “{answer}”.");

addRows("A1", "Present Simple", [
  ["Kate ___ tea every morning.", "drinks", "drink", "is drinking", "drinking"],
  ["We ___ near the city centre.", "live", "lives", "are live", "living"],
  ["My dog ___ under my desk.", "sleeps", "sleep", "is sleep", "sleeping"],
  ["I ___ my room on Saturdays.", "clean", "cleans", "am clean", "cleaning"],
  ["Ben ___ his bike to school.", "rides", "ride", "is ride", "riding"],
  ["They ___ lunch at school.", "have", "has", "are having every day", "having"],
  ["Our teacher ___ us a lot of questions.", "asks", "ask", "is ask", "asking"],
  ["The shop ___ at eight in the evening.", "closes", "close", "is close", "closing"],
  ["You always ___ your keys here.", "put", "puts", "are put", "putting"],
  ["Emma ___ two languages.", "speaks", "speak", "is speak", "speaking"],
], "Use Present Simple for routines and facts. Choose “{answer}”.");

addRows("A1", "Present Continuous", [
  ["I ___ breakfast now.", "am eating", "is eating", "eat", "ate"],
  ["Dad ___ the car at the moment.", "is washing", "are washing", "washes", "washed"],
  ["We ___ for the bus now.", "are waiting", "is waiting", "wait", "waited"],
  ["Look! The baby ___ .", "is smiling", "are smiling", "smiles", "smiled"],
  ["You ___ very fast today.", "are walking", "is walking", "walk", "walked"],
  ["My friends ___ a video now.", "are watching", "is watching", "watch", "watched"],
  ["Anna ___ her new dress today.", "is wearing", "are wearing", "wears", "wore"],
  ["The cat ___ with a ball.", "is playing", "are playing", "plays", "played"],
  ["I ___ to my teacher right now.", "am talking", "is talking", "talk", "talked"],
  ["The children ___ pictures at the moment.", "are drawing", "is drawing", "draw", "drew"],
], "Use am, is or are plus verb-ing for an action happening now.");

addRows("A1", "Articles", [
  ["Tom has ___ blue bike.", "a", "an", "the", "—"], ["I need ___ umbrella.", "an", "a", "the", "—"],
  ["Please close ___ window next to you.", "the", "a", "an", "—"], ["She is ___ student.", "a", "an", "the", "—"],
  ["We saw ___ elephant at the zoo.", "an", "a", "the", "—"], ["___ Earth goes around the Sun.", "The", "A", "An", "—"],
  ["My brother wants ___ new phone.", "a", "an", "the", "—"], ["That is ___ old house.", "an", "a", "the", "—"],
  ["Where is ___ book I gave you?", "the", "a", "an", "—"], ["Amy is ___ tallest girl in our class.", "the", "a", "an", "—"],
], "Choose a, an or the according to the noun and meaning.");

addRows("A1", "Prepositions", [
  ["The shoes are ___ the bed.", "under", "on", "at", "between"], ["Our lesson starts ___ ten o’clock.", "at", "in", "on", "under"],
  ["I visit my grandma ___ Sunday.", "on", "in", "at", "between"], ["We go on holiday ___ August.", "in", "on", "at", "behind"],
  ["The bank is ___ the café and the shop.", "between", "in", "on", "at"], ["There is a photo ___ the desk.", "on", "in", "at", "between"],
  ["My coat is ___ the door.", "behind", "at", "between", "in"], ["The children are ___ the classroom.", "in", "on", "at", "under"],
  ["Meet me ___ the bus stop.", "at", "on", "in", "behind"], ["The lamp is ___ the sofa.", "near", "at", "in", "between"],
], "Choose the basic preposition of place or time.");

addRows("A1", "There is / There are", [
  ["___ a cat in the garden.", "There is", "There are", "It are", "They is"], ["___ five books on the desk.", "There are", "There is", "It has", "They has"],
  ["___ any cheese in the fridge?", "Is there", "Are there", "Does there", "There are"], ["___ any children in the park?", "Are there", "Is there", "Do there", "There is"],
  ["There ___ a new student in our class.", "is", "are", "have", "be"], ["There ___ two cups on the table.", "are", "is", "has", "be"],
  ["There aren’t ___ clean plates.", "any", "some", "a", "much"], ["There are ___ apples in the bag.", "some", "any", "a", "much"],
  ["How many people ___ in the room?", "are there", "is there", "there are", "do there"], ["There ___ not any bread left.", "is", "are", "have", "does"],
], "Use there is for singular nouns and there are for plural nouns.");

addRows("A1", "Questions", [
  ["___ your parents work here?", "Do", "Does", "Are", "Is"], ["___ Tom like pizza?", "Does", "Do", "Is", "Has"],
  ["Where ___ your sister study?", "does", "do", "is", "has"], ["What ___ you eat for breakfast?", "do", "does", "are", "is"],
  ["___ they playing outside now?", "Are", "Do", "Does", "Is"], ["What ___ Mum cooking?", "is", "does", "do", "are"],
  ["___ you watch the match yesterday?", "Did", "Do", "Were", "Have"], ["When ___ Sam arrive?", "did", "does", "was", "has"],
  ["Where ___ my glasses?", "are", "is", "do", "does"], ["How ___ your new teacher?", "is", "does", "has", "are"],
], "Choose the correct auxiliary or form of be for the question.");

addRows("A2", "Prepositions", [
  ["She is interested ___ astronomy.", "in", "on", "at", "for"],
  ["We arrived ___ the station at noon.", "at", "in", "to", "on"],
  ["He is good ___ solving puzzles.", "at", "in", "for", "with"],
  ["This module belongs ___ our team.", "to", "for", "at", "with"],
  ["The mission depends ___ the weather.", "on", "from", "at", "of"],
  ["They apologised ___ the delay.", "for", "about", "to", "of"],
  ["I’m afraid ___ deep water.", "of", "from", "with", "at"],
  ["The cabin is full ___ equipment.", "of", "with", "from", "by"],
  ["She is responsible ___ navigation.", "for", "of", "to", "on"],
  ["We talked ___ the new discovery.", "about", "at", "for", "by"],
], "This adjective or verb takes the preposition “{answer}”.");

addRows("A2", "Present Perfect", [
  ["I ___ this film three times.", "have seen", "saw", "see", "am seeing"],
  ["We ___ the museum yesterday.", "visited", "have visited", "visit", "had visited"],
  ["She ___ her homework yet.", "hasn’t finished", "didn’t finish", "isn’t finishing", "doesn’t finish"],
  ["They ___ here since 2024.", "have lived", "lived", "are living", "live"],
  ["Leo ___ the captain last Monday.", "met", "has met", "meets", "was meeting"],
  ["___ you ever ___ a rocket launch?", "Have / seen", "Did / see", "Do / see", "Are / seeing"],
  ["I ___ my keys, so I can’t open the door.", "have lost", "lost yesterday", "lose", "am losing"],
  ["The shuttle ___ ten minutes ago.", "left", "has left", "leaves", "has been leaving"],
  ["This is the best book I ___ .", "have ever read", "ever read yesterday", "am reading", "had read last week"],
  ["How long ___ you ___ English?", "have / studied", "did / study", "are / study", "do / studied"],
], "Use Present Perfect for experience or a present result, and Past Simple with a finished past time.");

addRows("B1", "Relative Clauses", [
  ["The engineer ___ repaired the engine is from Canada.", "who", "which", "where", "whose"],
  ["This is the device ___ measures radiation.", "which", "who", "where", "whose"],
  ["That is the station ___ we first met.", "where", "which", "who", "whose"],
  ["The student ___ project won is in my class.", "whose", "who", "which", "where"],
  ["The book ___ you lent me was excellent.", "that", "who", "where", "whose"],
  ["Mars, ___ has two moons, is smaller than Earth.", "which", "that", "who", "where"],
  ["The pilot to ___ I spoke was very calm.", "whom", "which", "whose", "where"],
  ["Do you remember the day ___ we launched?", "when", "which", "who", "whose"],
  ["The reason ___ the mission failed is unclear.", "why", "where", "who", "whose"],
  ["My sister, ___ lives in Berlin, teaches English.", "who", "that", "which", "where"],
], "Choose the relative word that refers correctly to the person, thing, place, time or possession.");

addRows("B1", "Gerunds & Infinitives", [
  ["She enjoys ___ science fiction.", "reading", "to read", "read", "to reading"],
  ["We decided ___ the mission.", "to continue", "continuing", "continue", "to continuing"],
  ["He suggested ___ a different route.", "taking", "to take", "take", "to taking"],
  ["I hope ___ an astronaut one day.", "to become", "becoming", "become", "to becoming"],
  ["They avoided ___ the damaged corridor.", "using", "to use", "use", "used"],
  ["Mia promised ___ on time.", "to arrive", "arriving", "arrive", "to arriving"],
  ["Would you mind ___ the window?", "closing", "to close", "close", "closed"],
  ["We can’t afford ___ more fuel.", "to buy", "buying", "buy", "to buying"],
  ["He finished ___ the report.", "writing", "to write", "write", "written"],
  ["The teacher encouraged us ___ questions.", "to ask", "asking", "ask", "to asking"],
], "The first verb determines whether the next verb takes -ing or to + infinitive.");

addRows("B1", "Modal Verbs", [
  ["You ___ submit the report by Friday; it’s compulsory.", "have to", "might", "could", "don’t have to"],
  ["Visitors ___ enter this area without permission.", "mustn’t", "don’t have to", "should", "may"],
  ["We ___ bring food; it is provided.", "don’t have to", "mustn’t", "can’t", "shouldn’t"],
  ["She ___ be at home; her lights are on.", "must", "can’t", "shouldn’t", "needn’t"],
  ["He ___ be the pilot; he is only twelve.", "can’t", "must", "may", "should"],
  ["The signal ___ come from another galaxy, but we aren’t sure.", "might", "must", "can’t", "has to"],
  ["You ___ have told me earlier.", "should", "can", "may", "will"],
  ["___ you help me with this module?", "Could", "Must", "Shall to", "Need"],
  ["We ___ leave until the storm ends.", "shouldn’t", "must", "could", "may"],
  ["The team ___ solve the problem after several attempts.", "was able to", "could to", "can", "must"],
], "The modal expression must match obligation, permission, probability or advice.");

addRows("B1", "Past Perfect", [
  ["By the time we arrived, the shuttle ___ .", "had left", "has left", "left", "was leaving"],
  ["She was tired because she ___ all night.", "had been working", "has worked", "worked", "was worked"],
  ["I ___ him before yesterday’s meeting.", "had never met", "have never met", "never met", "was never meeting"],
  ["When I opened the door, I realised someone ___ inside.", "had been", "has been", "was", "is"],
  ["They ___ for two hours when help arrived.", "had been waiting", "have waited", "waited", "were waited"],
  ["We ___ the repair before the captain returned.", "had completed", "have completed", "completed after", "were completing"],
  ["How long ___ before you moved here?", "had you lived there", "have you lived there", "did you live there now", "were you live"],
  ["The ground was wet because it ___ .", "had been raining", "has rained", "rained tomorrow", "was rain"],
  ["She knew the answer because she ___ the manual.", "had read", "has read", "reads", "was reading now"],
  ["After they ___ the signal, they contacted Earth.", "had decoded", "have decoded", "decode", "are decoding"],
], "Use a past perfect form for an action completed or continuing before another past event.");

addRows("B2", "Relative Clauses", [
  ["The data, much of ___ was incomplete, had to be checked again.", "which", "that", "what", "whom"],
  ["The scientist with ___ we collaborated won an award.", "whom", "who", "which", "whose"],
  ["There are several reasons, the most important of ___ is safety.", "which", "that", "what", "them"],
  ["The year 2060 was the point at ___ space travel changed forever.", "which", "where", "that", "what"],
  ["The two modules, neither of ___ was working, were replaced.", "which", "them", "that", "what"],
  ["Anyone ___ to join must complete the training.", "wishing", "who wishing", "wished", "is wishing"],
  ["The samples ___ from Mars are being analysed.", "collected", "collecting", "were collect", "which collected"],
  ["The first person ___ the code will receive a prize.", "to solve", "solving first", "who solve", "solved"],
  ["The cabin in ___ they stayed had no windows.", "which", "where", "that", "what"],
  ["She gave two explanations, neither of ___ was convincing.", "which", "that", "them", "what"],
], "Advanced relative clauses may use prepositions, quantifiers or reduced forms.");

addRows("B2", "Gerunds & Infinitives", [
  ["I remember ___ the hatch, but it is open now.", "closing", "to close", "close", "closed"],
  ["Remember ___ the hatch before launch.", "to close", "closing", "close", "to closing"],
  ["We stopped ___ when the alarm sounded.", "working", "to work", "work", "worked"],
  ["We stopped ___ at the station on our way home.", "to refuel", "refueling", "refuel", "to refueling"],
  ["Try ___ the system if the screen freezes.", "restarting", "to restart only", "restart to", "restarted"],
  ["He regretted ___ the warning.", "ignoring", "to ignore", "ignore", "ignored to"],
  ["The device needs ___ before use.", "checking", "to checking", "check", "checked to"],
  ["She went on ___ despite the noise.", "working", "to work next", "work", "worked"],
  ["I meant ___ you, but I forgot.", "to call", "calling", "call", "to calling"],
  ["Being a pilot means ___ responsibility.", "accepting", "to accept once", "accept", "accepted"],
], "Meaning can change depending on whether the verb is followed by -ing or an infinitive.");

addRows("B2", "Passive Voice", [
  ["The captain is believed ___ the station.", "to have left", "to leave yesterday", "leaving", "has left"],
  ["The device ___ before it was installed.", "had been tested", "had tested", "was testing", "has test"],
  ["The ship appears ___ during the storm.", "to have been damaged", "to damage", "damaging", "has damaged"],
  ["It is expected that the results ___ tomorrow.", "will be announced", "will announce", "announce", "are announce"],
  ["The crew resented ___ without warning.", "being moved", "moving", "to be move", "been moved"],
  ["This module should ___ by a specialist.", "have been repaired", "have repaired", "be repairing yesterday", "has repair"],
  ["The samples are thought ___ on Mars.", "to have originated", "to originate yesterday", "originating", "have originated"],
  ["The new route ___ when the accident happened.", "was being tested", "tested", "has tested", "was testing it"],
  ["She hates ___ what to do.", "being told", "telling", "to told", "been tell"],
  ["No explanation ___ so far.", "has been provided", "has provided", "was providing", "is provide"],
], "Use the advanced passive form that matches the time and structure of the sentence.");

addRows("B2", "Reported Speech", [
  ["She denied ___ the access code.", "sharing", "to share", "share", "that share"],
  ["He admitted ___ the warning.", "having ignored", "to ignore", "ignore", "had ignore"],
  ["The captain warned us ___ the red switch.", "not to touch", "don’t touch", "not touching", "to not touched"],
  ["Mia suggested that we ___ the test.", "repeat", "repeated", "will repeat", "repeating"],
  ["He accused the engineer ___ the data.", "of changing", "to change", "for change", "that changed"],
  ["She reminded me ___ the report.", "to send", "sending", "send", "that sending"],
  ["They insisted ___ checking every module.", "on", "to", "for", "at"],
  ["The scientist claimed ___ the pattern before.", "to have seen", "seeing yesterday", "see", "has see"],
  ["He regretted that he ___ more careful.", "hadn’t been", "wasn’t being now", "isn’t", "hasn’t be"],
  ["She asked me how long I ___ there.", "had been working", "have been working", "am working", "will work"],
], "Reporting verbs require specific patterns such as -ing, infinitive, preposition or backshift.");

addRows("B2", "Linking Words", [
  ["___ the heavy rain, the launch continued.", "Despite", "Although", "Because", "However"],
  ["___ it was raining heavily, the launch continued.", "Although", "Despite", "In spite", "Because of"],
  ["The route is shorter; ___, it is more dangerous.", "however", "therefore", "moreover", "because"],
  ["The engine failed; ___, the mission was postponed.", "therefore", "however", "although", "whereas"],
  ["The device is small. ___, it is extremely powerful.", "Nevertheless", "Consequently", "Because", "In addition to"],
  ["We chose the northern route ___ avoid the storm.", "in order to", "so that", "because", "despite"],
  ["She spoke quietly ___ nobody would hear her.", "so that", "in order to", "despite", "therefore"],
  ["___ being exhausted, the crew completed the repair.", "In spite of", "Although", "However", "Because"],
  ["The first plan was cheap, ___ the second was safer.", "whereas", "therefore", "because", "moreover"],
  ["The signal was weak; ___, we managed to decode it.", "even so", "as a result", "because", "in addition"],
], "Choose the linker that expresses the intended contrast, result, purpose or concession.");

addRows("C1", "Participle Clauses", [
  ["___ the warning, the captain changed course.", "Having seen", "Seen", "To seeing", "Have seen"],
  ["___ by the sudden noise, the crew froze.", "Startled", "Startling", "Having startle", "To startled"],
  ["___ all night, she was too tired to continue.", "Having worked", "Worked", "To work", "Being work"],
  ["___ from orbit, the storm looked enormous.", "Seen", "Seeing", "Having see", "To seeing"],
  ["___ what to do, he contacted mission control.", "Not knowing", "Not known", "Having not know", "To not knowing"],
  ["The shuttle crossed the atmosphere, ___ a bright trail.", "leaving", "left", "having leave", "to left"],
  ["___ properly, the device should last for years.", "Maintained", "Maintaining", "Having maintain", "To maintained"],
  ["___ the data, the team published its findings.", "Having analysed", "Analysed by", "To analysing", "Being analyse"],
  ["The signal disappeared, ___ no trace.", "leaving", "left", "to leave yesterday", "having leave"],
  ["___ access to the lab, she waited outside.", "Denied", "Denying", "Having deny", "To denied"],
], "A participle clause compresses a reason, time or result clause while keeping the same subject.");

addRows("C1", "Advanced Structures", [
  ["It was the navigation system ___ caused the failure.", "that", "what", "which it", "who"],
  ["What the crew needed ___ a clear decision.", "was", "were", "have been", "being"],
  ["The reason she resigned ___ that the project lacked funding.", "was", "which", "because", "what"],
  ["Not until dawn ___ the full extent of the damage.", "did we realise", "we realised", "had we realise", "we did realise"],
  ["Only by working together ___ the mission.", "could they complete", "they could complete", "did complete they", "they completed can"],
  ["Seldom ___ such dedication from a new crew.", "have I witnessed", "I have witnessed", "did I witnessed", "I witnessed have"],
  ["At no point ___ permission to leave.", "were they given", "they were given", "did they gave", "they gave"],
  ["So complex ___ that the test took three days.", "was the system", "the system was", "did the system", "the system did"],
  ["Such ___ that nobody questioned her decision.", "was her authority", "her authority was", "did her authority", "authority she had"],
  ["Had it not been for the robot, we ___ the repair.", "couldn’t have finished", "didn’t finish", "won’t finish", "hadn’t finished"],
], "Cleft sentences and inversion add emphasis and require special word order.");

addRows("C1", "Advanced Passive", [
  ["The minister is reported ___ the proposal.", "to have rejected", "to reject yesterday", "rejecting", "has rejected"],
  ["The samples are believed ___ during transport.", "to have been contaminated", "to contaminate", "contaminating", "have contaminated"],
  ["It has been suggested that the procedure ___ revised.", "be", "is", "will be", "being"],
  ["The discovery is thought ___ our understanding of space.", "to have transformed", "transforming yesterday", "has transform", "to transformed"],
  ["No passenger should ___ access without identification.", "be granted", "grant", "have granting", "be grant"],
  ["The crew were made ___ the entire protocol.", "to repeat", "repeat", "repeating", "to repeating"],
  ["The equipment requires ___ before deployment.", "being calibrated", "to calibrating", "calibrate", "been calibrate"],
  ["The captain objected to ___ responsible for the delay.", "being held", "holding", "be held", "been holding"],
  ["The files appear ___ deliberately.", "to have been deleted", "to delete", "deleting", "have deleted"],
  ["It was agreed that no further action ___ until morning.", "be taken", "is taken", "will take", "taking"],
], "Formal passive and reporting structures require the correct infinitive, gerund or subjunctive form.");

// Extra mission cards keep every selectable topic at ten tasks or more.
addRows("A2", "Future Forms", [
  ["The pavement is already wet, and those dark clouds mean it ___ again.", "is going to rain", "will raining", "rains yesterday", "has rain"],
  ["This time tomorrow, we ___ over the Atlantic.", "will be flying", "fly", "are flew", "will flying"],
], "Choose will, be going to or a continuous future form according to the evidence and time expression.");

addRows("B1", "Passive Voice", [
  ["The new telescope ___ next month.", "will be installed", "will install", "is installing it", "has install"],
  ["The reports ___ yet.", "haven’t been checked", "haven’t checked", "weren’t checking", "don’t been check"],
  ["This door must ___ at all times.", "be kept closed", "keep closed", "be keep close", "kept closing"],
], "In the passive, the object becomes the subject and the verb uses be plus a past participle.");

addRows("B1", "Reported Speech", [
  ["‘I can repair it,’ Ava said. Ava said that she ___ repair it.", "could", "can", "will can", "has"],
  ["‘Where are you going?’ He asked me where I ___ .", "was going", "am going", "did I go", "have went"],
  ["‘Don’t open the hatch,’ she told us. She told us ___ the hatch.", "not to open", "don’t open", "not opening", "to not opened"],
], "Reported statements, questions and commands usually require backshift and statement word order.");

addRows("B2", "Future Forms", [
  ["By next Friday, the team ___ the repairs.", "will have completed", "will complete yesterday", "has completed", "will be complete"],
  ["At eight tomorrow, we ___ the final system test.", "will be running", "will have run by eight", "run yesterday", "are ran"],
  ["By the time you arrive, I ___ for six hours.", "will have been working", "will work", "am working yesterday", "have worked tomorrow"],
  ["The train ___ at 06:40 tomorrow morning.", "leaves", "will leaving", "is leave", "has left tomorrow"],
  ["We ___ the director at noon; the appointment is confirmed.", "are meeting", "meet yesterday", "will met", "have meeting"],
  ["Don’t call at nine; I ___ a live briefing.", "will be giving", "will have given before nine", "give yesterday", "am gave"],
  ["This is the last warning: the system ___ down unless we act.", "is going to shut", "will shutting", "shuts yesterday", "has shut tomorrow"],
  ["Once the storm ___, the crew will leave.", "has passed", "will pass", "will have pass", "passing"],
], "Future meaning may use future perfect, future continuous, a present tense or a planned arrangement.");

addRows("B2", "Conditionals", [
  ["If the backup system had worked, we ___ the delay.", "would have avoided", "would avoid yesterday", "will have avoided", "avoided now"],
  ["If I ___ you, I would reconsider the route.", "were", "am", "will be", "had been yesterday"],
  ["Had the pilot reacted sooner, the damage ___ less serious.", "would have been", "will be", "would be tomorrow", "had been now"],
  ["If she weren’t so experienced, she ___ the team last year.", "wouldn’t have led", "won’t lead", "hadn’t led", "doesn’t lead"],
  ["Should you need assistance, ___ the blue button.", "press", "pressed", "will pressing", "to pressed"],
], "Advanced and mixed conditionals connect hypothetical causes and results across different times.");

addRows("B2", "Modal Verbs", [
  ["The lights are off; they ___ have left already.", "must", "should to", "can", "ought"],
  ["You ___ have checked the fuel before launch.", "should", "must to", "can", "will"],
  ["The message ___ have been sent by Ava, but we are not certain.", "might", "must to", "can to", "should to"],
  ["He ___ have repaired it; he was on another station.", "can’t", "must", "should", "might to"],
], "Use a modal plus have and a past participle to speculate about or evaluate past events.");

addRows("C1", "Conditionals", [
  ["Were the data to prove inaccurate, the study ___ withdrawn.", "would be", "will have", "was", "had been"],
  ["But for the technician’s quick response, the engine ___ .", "would have exploded", "will explode", "exploded now", "would explode yesterday"],
  ["If it hadn’t been for the delay, we ___ by now.", "would be home", "will be home yesterday", "were home tomorrow", "had been home now"],
  ["Had she not intervened, the talks ___ completely.", "might have collapsed", "might collapse yesterday", "will collapse", "had collapsing"],
  ["Supposing the signal ___ genuine, what would our next step be?", "were", "is", "will be", "has been yesterday"],
], "Inverted, mixed and implied conditionals express remote hypotheses in formal or advanced English.");

addRows("C1", "Modal Verbs", [
  ["You ___ have informed the committee before changing the plan.", "ought to", "must to", "can to", "may to"],
  ["The results ___ conceivably have been affected by temperature.", "could", "must to", "should to", "ought"],
  ["She ___ have known about the fault; nobody had told her.", "couldn’t", "must", "ought to", "should"],
  ["The crew ___ well have misunderstood the instruction.", "may", "can to", "must to", "ought"],
  ["You ___ have gone to so much trouble; a short email was enough.", "needn’t", "mustn’t", "couldn’t", "wouldn’t to"],
  ["The policy ___ be revised if the evidence is confirmed.", "may well", "can to", "ought", "must to"],
], "Advanced modal patterns express nuanced degrees of certainty, criticism, necessity and possibility.");

// Curated expansion: every row adds a genuinely new context rather than a name-swap copy.
addRows("A1", "Present Simple", [
  ["Our neighbour ___ fresh bread every morning.", "bakes", "bake", "is baking", "baked"],
  ["I never ___ my phone during lessons.", "use", "uses", "am using", "used"],
  ["The sports centre ___ at ten on Sundays.", "opens", "open", "is opening", "opened"],
  ["My cousins often ___ board games after dinner.", "play", "plays", "are play", "played"],
  ["Ella ___ her grandparents every weekend.", "visits", "visit", "is visit", "visited"],
], "Present Simple describes routines, repeated actions and facts.");
addRows("A1", "Present Continuous", [
  ["Be careful! You ___ the paint.", "are touching", "touch", "is touching", "touched"],
  ["We ___ for the school concert this week.", "are practising", "practise", "is practising", "practised"],
  ["Why ___ the dog ___ at the window?", "is / barking", "does / bark", "are / barking", "did / bark"],
  ["I can’t talk now; I ___ the bus.", "am catching", "catch", "is catching", "caught"],
  ["The café ___ a new menu today.", "is testing", "tests", "are testing", "tested"],
], "Use am, is or are plus verb-ing for an action happening now or temporarily.");
addRows("A1", "Past Simple", [
  ["We ___ a tiny bookshop near the station.", "discovered", "discover", "are discovering", "have discover"],
  ["My aunt ___ me how to make pancakes.", "taught", "teach", "teached", "has teach"],
  ["The match ___ ten minutes late.", "started", "starts", "is starting", "has start"],
  ["I ___ my umbrella on the train.", "forgot", "forget", "forgetted", "have forget"],
  ["They ___ the old table and painted it green.", "fixed", "fix", "are fixing", "have fix"],
], "Past Simple describes a completed action at a finished past time.");
addRows("A1", "Articles", [
  ["We stayed in ___ small hotel near the beach.", "a", "an", "the", "—"],
  ["Could you close ___ window next to you?", "the", "a", "an", "—"],
  ["My sister wants to buy ___ electric guitar.", "an", "a", "the", "—"],
  ["Mount Everest is ___ highest mountain on Earth.", "the", "a", "an", "—"],
  ["I need ___ new pair of headphones.", "a", "an", "the", "—"],
], "Choose a, an or the according to sound, meaning and whether the noun is specific.");
addRows("A1", "Questions", [
  ["How often ___ your class visit the library?", "does", "do", "is", "has"],
  ["What ___ you doing after school today?", "are", "do", "did", "is"],
  ["Why ___ the shop close early yesterday?", "did", "does", "was", "has"],
  ["___ there a pharmacy near here?", "Is", "Are", "Does", "Has"],
  ["Which bus ___ to the city centre?", "goes", "go", "is go", "going"],
], "Build the question with the correct auxiliary and word order.");

addRows("A2", "Present Perfect", [
  ["I ___ this recipe twice, and it works well.", "have tried", "tried yesterday", "has tried", "am trying"],
  ["The parcel ___ yet.", "hasn’t arrived", "didn’t arrive yet", "haven’t arrived", "isn’t arrive"],
  ["___ you ever ___ in a school play?", "Have / acted", "Did / acted", "Has / act", "Are / acting"],
  ["We ___ each other since primary school.", "have known", "knew", "are knowing", "has known"],
  ["She ___ three chapters so far today.", "has written", "wrote last night", "have written", "is write"],
], "Present Perfect connects past experience or an unfinished time period with the present.");
addRows("A2", "Comparatives", [
  ["This route is ___ than the one through the town centre.", "less crowded", "the least crowded", "crowdeder", "more crowd"],
  ["The blue suitcase is slightly ___ than the black one.", "lighter", "lightest", "more light", "the lighter"],
  ["That was ___ meal I have had this month.", "the most delicious", "more delicious", "deliciouser", "the delicious"],
  ["Online tickets are usually ___ than tickets at the door.", "cheaper", "cheapest", "more cheap", "the cheaper"],
  ["My new desk is much ___ for drawing.", "more comfortable", "comfortabler", "the most comfortable", "comfortable"],
], "Use a comparative for two things and a superlative for the highest or lowest degree in a group.");
addRows("A2", "Modal Verbs", [
  ["You ___ bring food; there will be plenty at the party.", "don’t have to", "mustn’t", "can’t", "shouldn’t to"],
  ["This bag is very heavy. ___ you help me?", "Could", "Must", "Should to", "May to"],
  ["Students ___ return library books by Friday.", "must", "might", "could", "must to"],
  ["You ___ take photos here; the sign forbids it.", "mustn’t", "don’t have to", "may", "should"],
  ["The keys aren’t here. Dad ___ have them in his pocket.", "might", "must to", "can to", "should to"],
], "Choose the modal that expresses the intended obligation, prohibition, request or possibility.");
addRows("A2", "Future Forms", [
  ["I have booked the table. We ___ there at seven.", "are eating", "will eat perhaps", "eat yesterday", "have eaten"],
  ["The phone is ringing. I ___ it.", "will answer", "am going answer", "answer yesterday", "am answered"],
  ["Look at that child! He ___ into the puddle.", "is going to step", "will stepping", "steps yesterday", "has step"],
  ["Our train ___ at 14:05 tomorrow.", "leaves", "will leaving", "left", "has leave"],
  ["Do you think the new café ___ popular?", "will become", "is become", "became tomorrow", "has becoming"],
], "Use the future form supported by the evidence, arrangement, timetable, decision or prediction.");

addRows("B1", "Conditionals", [
  ["If you don’t save the document, you ___ your changes.", "will lose", "would lose yesterday", "lost", "have lost"],
  ["If I had a larger kitchen, I ___ more often.", "would bake", "will bake", "baked yesterday", "am bake"],
  ["Unless the weather improves, the concert ___ indoors.", "will take place", "would took place", "takes yesterday", "has taking"],
  ["What would you change if you ___ the head teacher?", "were", "are", "will be", "have been yesterday"],
  ["If Maya practises every day, she ___ much more confident.", "will become", "would became", "becomes yesterday", "has become tomorrow"],
], "Choose the conditional pattern that matches a real future possibility or an unreal present situation.");
addRows("B1", "Passive Voice", [
  ["The final scene ___ in an old theatre last winter.", "was filmed", "filmed", "is filming", "has film"],
  ["All applications must ___ before 6 p.m.", "be submitted", "submit", "be submit", "submitted"],
  ["The community garden ___ by local volunteers.", "is maintained", "maintains", "is maintaining it", "has maintain"],
  ["The missing painting ___ yet.", "hasn’t been found", "hasn’t found", "wasn’t finding", "doesn’t been find"],
  ["A new cycle path ___ next year.", "will be built", "will build", "is build", "will building"],
], "Passive voice focuses on the receiver of the action: be plus past participle.");
addRows("B1", "Reported Speech", [
  ["‘I’m working from home,’ Ben said. Ben said he ___ from home.", "was working", "is working", "worked tomorrow", "has work"],
  ["‘Have you seen my notebook?’ She asked me if I ___ her notebook.", "had seen", "have saw", "did I see", "see"],
  ["‘Please wait outside,’ the doctor said. The doctor asked us ___ outside.", "to wait", "wait", "waiting", "that wait"],
  ["‘We’ll call you tomorrow,’ they said. They said they ___ me the next day.", "would call", "will called", "call yesterday", "had call"],
  ["‘Why did you leave early?’ Dad asked why I ___ early.", "had left", "did I leave", "have leave", "leave"],
], "Reported speech changes tense, pronouns, time references and question order when needed.");
addRows("B1", "Gerunds & Infinitives", [
  ["I can’t afford ___ a new laptop this month.", "to buy", "buying", "buy", "to buying"],
  ["She suggested ___ the earlier train.", "taking", "to take", "take", "to taking"],
  ["We stopped ___ some water before continuing the walk.", "to buy", "buying forever", "buy", "to buying"],
  ["He admitted ___ the wrong file.", "deleting", "to delete", "delete", "to deleting"],
  ["Remember ___ the door when you leave.", "to lock", "locking yesterday", "lock", "to locking"],
], "The first verb determines whether the next verb takes a gerund or an infinitive.");

addRows("B2", "Linking Words", [
  ["The flat is small; ___, it has plenty of natural light.", "nevertheless", "therefore", "because", "in order to"],
  ["The road was closed, ___ we had to take a long detour.", "so", "although", "despite", "whereas of"],
  ["___ having little experience, she handled the interview confidently.", "Despite", "Although", "Because", "Therefore"],
  ["I wrote the instructions down ___ nobody would forget a step.", "so that", "despite", "whereas", "however"],
  ["The first proposal is cheaper, ___ the second is more sustainable.", "whereas", "therefore", "because of", "in order to"],
], "Select a linker that expresses the intended contrast, result, concession or purpose.");
addRows("B2", "Relative Clauses", [
  ["The journalist, ___ article exposed the fraud, received an award.", "whose", "who", "which", "where"],
  ["The cottage ___ we spent the summer has been sold.", "where", "which", "whose", "whom"],
  ["The colleague to ___ I sent the draft is on leave.", "whom", "who", "which", "whose"],
  ["The documentary, ___ was filmed over five years, is remarkable.", "which", "that it", "where", "whose"],
  ["That was the moment ___ I realised the plan would work.", "when", "which", "whose", "whom"],
], "Choose the relative word according to reference and its grammatical role in the clause.");
addRows("B2", "Future Forms", [
  ["By the end of the course, students ___ six major projects.", "will have completed", "will complete yesterday", "are completing last year", "have complete"],
  ["This time next week, I ___ along the coast.", "will be travelling", "will travel yesterday", "travelled tomorrow", "have travelling"],
  ["The exhibition ___ on 3 September according to the programme.", "opens", "will opening", "has opened tomorrow", "is open yesterday"],
  ["By 8 p.m., the guests ___, so we can start dinner then.", "will have arrived", "will be arrive", "arrived tomorrow", "have arriving"],
  ["Don’t call at noon; we ___ the final presentation.", "will be giving", "will have give", "gave tomorrow", "are given"],
], "Future continuous describes an action in progress; future perfect looks back from a future deadline.");
addRows("B2", "Modal Verbs", [
  ["You ___ have mentioned the allergy before we ordered.", "should", "must to", "can", "may to"],
  ["The parcel ___ have been delivered to the wrong address.", "might", "must to", "can to", "ought"],
  ["She ___ have written this note; the handwriting is completely different.", "can’t", "must", "should", "may to"],
  ["They ___ have taken a taxi; the last bus was still running.", "needn’t", "mustn’t", "couldn’t", "wouldn’t to"],
  ["Judging by the lights, somebody ___ be working upstairs.", "must", "can to", "should to", "ought"],
], "Modal perfect forms express deduction, possibility, criticism or unnecessary past action.");

addRows("C1", "Advanced Structures", [
  ["Only after rereading the contract ___ the hidden fee.", "did we notice", "we noticed", "had we notice", "we did noticed"],
  ["Under no circumstances ___ confidential files on a personal device.", "should staff store", "staff should store", "do staff stored", "staff stores"],
  ["Not until the final rehearsal ___ how demanding the role was.", "did she realise", "she realised", "had she realise", "she did realised"],
  ["So convincing ___ that several experts accepted the claim.", "was the evidence", "the evidence was", "did the evidence", "the evidence did"],
  ["It is vital that every applicant ___ identical information.", "receive", "receives", "will receive", "received"],
], "Formal emphasis may require inversion or the mandative subjunctive.");
addRows("C1", "Participle Clauses", [
  ["___ the figures twice, the analyst submitted the report.", "Having checked", "Checked", "To checking", "Having been check"],
  ["___ in several languages, the guide is accessible to most visitors.", "Written", "Writing", "Having write", "To written"],
  ["___ what to expect, we prepared several alternatives.", "Not knowing", "Not known", "Having not know", "To not knowing"],
  ["___ by the sudden announcement, investors demanded clarification.", "Alarmed", "Alarming", "Having alarm", "To alarming"],
  ["___ the earlier evidence, the committee reopened the case.", "Having reconsidered", "Reconsidering yesterday", "Having reconsider", "To reconsidering"],
], "A participle clause compresses information when its understood subject matches the main clause subject.");
addRows("C1", "Conditionals", [
  ["Had the warning been clearer, the misunderstanding ___ .", "could have been avoided", "can avoid yesterday", "will be avoiding", "had avoided itself"],
  ["Were the funding to disappear, several programmes ___ immediately.", "would close", "will closed", "closed tomorrow", "had closing"],
  ["If the negotiations had succeeded, we ___ a very different situation now.", "would be facing", "will face yesterday", "had faced now", "face"],
  ["Should any participant withdraw, the schedule ___ accordingly.", "will be adjusted", "would adjusted", "adjusted yesterday", "has adjusting"],
  ["But for her detailed notes, we ___ the sequence of events.", "might never have reconstructed", "will never reconstruct yesterday", "had never reconstruct", "never reconstructing"],
], "Advanced conditionals may use inversion, mixed time reference or an implied condition.");

export const grammarTasks = tasks;

export function topicsForLevel(level: Level) {
  return [...new Set(grammarTasks.filter((task) => task.level === level).map((task) => task.topic))].sort();
}

export function tasksFor(level: Level, topic: string) {
  return grammarTasks.filter((task) => task.level === level && task.topic === topic);
}
