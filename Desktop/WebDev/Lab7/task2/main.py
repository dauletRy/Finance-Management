from models import Animal, Dog, Cat

def main():
    animal = Animal("Prosto", 5, "unknown")
    dog = Dog("Sharik", 4, "Tazy")
    cat = Cat("Leopol'd", 2, "Ginger")

    animals = [animal, dog, cat]

    for a in animals:
        print(a)
        print(a.eat())
        print(a.make_sound())

    print(dog.sit_down())
    print(cat.sleep())


if __name__ == "__main__":
    main()