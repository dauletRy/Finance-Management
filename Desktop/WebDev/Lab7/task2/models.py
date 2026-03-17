class Animal:
    def __init__(self, name, age, species):
        self.name = name
        self.age = age
        self.species = species

    def make_sound(self):
        return "Sound"

    def eat(self):
        return f"{self.species} ({self.name}) is eating"

    def __str__(self):
        return f"Animal(name={self.name}, age={self.age}, species={self.species})"


class Dog(Animal):
    def __init__(self, name, age, breed):
        super().__init__(name, age, "Dog")
        self.breed = breed

    def make_sound(self):
        return "Gav"

    def sit_down(self):
        return f"{self.name} is sitting down!"

    def __str__(self):
        return f"Dog(name={self.name}, age={self.age}, breed={self.breed})"


class Cat(Animal):
    def __init__(self, name, age, color):
        super().__init__(name, age, "Cat")
        self.color = color

    def make_sound(self):
        return "Myau"

    def sleep(self):
        return f"{self.name} is sleeping"

    def __str__(self):
        return f"Cat(name={self.name}, age={self.age}, color={self.color})"