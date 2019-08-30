namespace App
{
    public class MyClass
    {
        public string ProduceWorld(string input)
        {
            return $"{input} World";
        }

        public int SumValues(int a, int b)
        {
            return a + b;
        }

        public int MaxInt(int a, int b)
        {
            if(a >= b)
                return a;
            else
                return b;
        }
    }
}