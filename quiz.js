// ==================== 25 JAVA PROGRAMMING QUESTIONS ====================
const quizQuestions = [
    { 
        question: "What is the correct way to declare a variable in Java?", 
        choices: ["int x;", "integer x;", "int x =;", "num x;"], 
        answer: "int x;" 
    },
    { 
        question: "Which of the following is NOT a Java data type?", 
        choices: ["int", "float", "double", "decimal"], 
        answer: "decimal" 
    },
    { 
        question: "What does JVM stand for?", 
        choices: ["Java Virtual Machine", "Java Variable Method", "Java Virtual Method", "Java Value Machine"], 
        answer: "Java Virtual Machine" 
    },
    { 
        question: "Which keyword is used to create a class in Java?", 
        choices: ["class", "Class", "CLASS", "define"], 
        answer: "class" 
    },
    { 
        question: "What is the output of System.out.println(5 + 5);?", 
        choices: ["10", "5 + 5", "'55'", "Error"], 
        answer: "10" 
    },
    { 
        question: "Which method is the entry point of a Java program?", 
        choices: ["main()", "start()", "run()", "init()"], 
        answer: "main()" 
    },
    { 
        question: "What is the correct syntax for a single-line comment in Java?", 
        choices: ["//", "/*", "<!--", "#"], 
        answer: "//" 
    },
    { 
        question: "Which of the following is a wrapper class in Java?", 
        choices: ["String", "Integer", "Array", "List"], 
        answer: "Integer" 
    },
    { 
        question: "What does the keyword 'static' mean in Java?", 
        choices: ["Non-changeable", "Belongs to the class", "Belongs to the object", "Cannot be used"], 
        answer: "Belongs to the class" 
    },
    { 
        question: "Which collection does NOT allow duplicate elements?", 
        choices: ["List", "Set", "Queue", "Stack"], 
        answer: "Set" 
    },
    { 
        question: "What is the default value of an integer variable in Java?", 
        choices: ["0", "null", "undefined", "1"], 
        answer: "0" 
    },
    { 
        question: "Which keyword is used to create an object in Java?", 
        choices: ["new", "create", "make", "init"], 
        answer: "new" 
    },
    { 
        question: "What does 'OOP' stand for in Java?", 
        choices: ["Object Oriented Programming", "Object Output Programming", "Online Object Programming", "Operation Oriented Process"], 
        answer: "Object Oriented Programming" 
    },
    { 
        question: "Which of the following is NOT an access modifier in Java?", 
        choices: ["public", "private", "protected", "secure"], 
        answer: "secure" 
    },
    { 
        question: "What is the correct way to create an array in Java?", 
        choices: ["int[] arr = new int[5];", "int arr[] = new int[5];", "Both A and B", "int arr = new int[5];"], 
        answer: "Both A and B" 
    },
    { 
        question: "Which exception is thrown when array index is out of bounds?", 
        choices: ["ArrayException", "IndexOutOfBoundsException", "OutOfBoundsException", "ArrayIndexException"], 
        answer: "IndexOutOfBoundsException" 
    },
    { 
        question: "What is the superclass of all classes in Java?", 
        choices: ["Object", "Class", "System", "String"], 
        answer: "Object" 
    },
    { 
        question: "Which method is used to compare two strings in Java?", 
        choices: ["compare()", "equals()", "check()", "match()"], 
        answer: "equals()" 
    },
    { 
        question: "What does the 'final' keyword do in Java?", 
        choices: ["Makes variable changeable", "Prevents modification", "Creates a new instance", "Deletes the variable"], 
        answer: "Prevents modification" 
    },
    { 
        question: "Which of the following is true about 'this' keyword in Java?", 
        choices: ["Refers to current class", "Refers to current object", "Refers to parent class", "Refers to static members"], 
        answer: "Refers to current object" 
    },
    { 
        question: "What is the correct way to declare a constant in Java?", 
        choices: ["const PI = 3.14;", "final double PI = 3.14;", "static PI = 3.14;", "PI = 3.14;"], 
        answer: "final double PI = 3.14;" 
    },
    { 
        question: "Which interface does ArrayList implement in Java?", 
        choices: ["Collection", "List", "Set", "Map"], 
        answer: "List" 
    },
    { 
        question: "What does the 'abstract' keyword do in Java?", 
        choices: ["Creates abstract methods only", "Cannot create objects directly", "Makes class static", "Increases performance"], 
        answer: "Cannot create objects directly" 
    },
    { 
        question: "Which package contains the String class in Java?", 
        choices: ["java.lang", "java.util", "java.io", "java.net"], 
        answer: "java.lang" 
    },
    { 
        question: "What is method overloading in Java?", 
        choices: ["Having multiple methods with same name but different parameters", "Inheriting methods from parent class", "Creating multiple objects", "Using static methods"], 
        answer: "Having multiple methods with same name but different parameters" 
    }
];